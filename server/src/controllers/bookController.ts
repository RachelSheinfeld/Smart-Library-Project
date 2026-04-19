import { Request, Response } from "express";
import Book from "../models/Book";


export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.find().populate("category");
    res.json(books);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id).populate("category");
    if (!book) 
        return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book)
         return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book)
         return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
