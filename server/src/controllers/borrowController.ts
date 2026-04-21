import { Request, Response } from "express";
import Borrow from "../models/Borrow";

export const getAllBorrows = async (req: Request, res: Response) => {
    try {
      const borrows = await Borrow.find()
        .populate("book")
        .populate("user");
  
      res.json(borrows);
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  };
  
const isBookAvailable = async (bookId: string) => {
  const activeBorrow = await Borrow.findOne({
    book: bookId,
    dueDate: { $gt: new Date() }
  });

  return activeBorrow ? activeBorrow.dueDate : null;
};

export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { user, book, dueDate } = req.body;

    const unavailableUntil = await isBookAvailable(book);

    if (unavailableUntil) {
      const now = new Date();
      const diffTime = unavailableUntil.getTime() - now.getTime();
      const daysUntilAvailable = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return res.status(400).json({
        message: "Book is not available",
        isAvailable: false,
        availableAt: unavailableUntil,
        daysUntilAvailable: daysUntilAvailable > 0 ? daysUntilAvailable : 0
      });
    }

    const borrow = await Borrow.create({ user, book, dueDate });

    res.status(201).json({
      message: "Book borrowed successfully",
      isAvailable: false,
      borrow
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow)
         return res.status(404).json({ message: "Borrow not found" });

    borrow.dueDate = new Date();
    await borrow.save();

    res.json({ message: "Book returned" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserBorrows = async (req: Request, res: Response) => {
  try {
    const borrows = await Borrow.find({ user: req.params.userId })
      .populate("book")
      .populate("user");

    res.json(borrows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


