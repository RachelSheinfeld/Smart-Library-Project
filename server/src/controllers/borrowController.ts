import { Request, Response } from "express";
import Borrow from "../models/Borrow";
// פונקציה לקבלת כל ההשאלות, כולל פרטי הספר והמשתמש, מהמסד נתונים
export const getAllBorrows = async (req: Request, res: Response) => {
  try {
    const borrows = await Borrow.find()
      //populate מביא את פרטי הספר והמשתמש
      .populate("book")
      .populate("user");

    res.json(borrows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
//פונקציה שבודקת אם ספר מסוים זמין להשאלה על ידי חיפוש 
// השאלה פעילה עם תאריך החזרה עתידי
const isBookAvailable = async (bookId: string) => {
  const activeBorrow = await Borrow.findOne({
    book: bookId,
    dueDate: { $gt: new Date() }
  });

  return activeBorrow ? activeBorrow.dueDate : null;
};
// פונקציה להשאלת ספר למשתמש,
//  כולל בדיקת זמינות הספר ויצירת השאלה חדשה במסד נתונים
export const borrowBook = async (req: Request, res: Response) => {
  try {
    const { user, book, dueDate } = req.body;

    const unavailableUntil = await isBookAvailable(book);

    if (unavailableUntil) {
      const now = new Date();
      // חישוב ההפרש בין התאריך הנוכחי לתאריך הזמינות של הספר
      const diffTime = unavailableUntil.getTime() - now.getTime();
      // חישוב מספר הימים עד שהספר יהיה זמין שוב
      const daysUntilAvailable = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return res.status(400).json({
        message: "Book is not available",
        isAvailable: false,
        availableAt: unavailableUntil,
        daysUntilAvailable: daysUntilAvailable > 0 ? daysUntilAvailable : 0
      });
    }
    // יצירת השאלה חדשה במסד נתונים
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
// פונקציה להחזרת ספר, כולל עדכון תאריך ההחזרה במסד נתונים
export const returnBook = async (req: Request, res: Response) => {
  try {
    const borrow = await Borrow.findById(req.params.id);

    if (!borrow)
      return res.status(404).json({ message: "Borrow not found" });
    // עדכון תאריך ההחזרה לשעת החזרה נוכחית
    borrow.dueDate = new Date();
    // שמירת העדכון במסד נתונים 
    await borrow.save();

    res.json({ message: "Book returned" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
// פונקציה לקבלת כל ההשאלות של משתמש מסוים,
//  כולל פרטי הספר והמשתמש, מהמסד נתונים
export const getUserBorrows = async (req: Request, res: Response) => {
  try {
    const borrows = await Borrow.find({ user: req.params.userId })
      //populate מביא את פרטי הספר והמשתמש

      .populate("book")
      .populate("user");

    res.json(borrows);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


