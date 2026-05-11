import { Request, Response } from "express";
import mongoose from "mongoose";
import Book from "../models/Book";
import Category from "../models/Category";

const resolveCategoryId = async (categoryInput: unknown) => {
  const categoryValue = String(categoryInput || '').trim();
  if (!categoryValue) {
    throw new Error('Category is required');
  }

  if (mongoose.isValidObjectId(categoryValue)) {
    const existing = await Category.findById(categoryValue);
    if (existing) {
      return existing._id;
    }
  }

  const existingByName = await Category.findOne({ name: categoryValue });
  if (existingByName) {
    return existingByName._id;
  }

  const category = await Category.create({ name: categoryValue });
  return category._id;
};

// פונקציה לקבלת כל הספרים, כולל פרטי הקטגוריה שלהם, מהמסד נתונים
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const query: Record<string, unknown> = {}
    const categoryFilter = req.query.category as string | undefined

    if (categoryFilter) {
      const categoryId = categoryFilter.trim()
      if (mongoose.isValidObjectId(categoryId)) {
        query.category = categoryId
      } else {
        const category = await Category.findOne({ name: categoryFilter })
        if (!category) {
          return res.json([])
        }
        query.category = category._id
      }
    }

    const books = await Book.find(query).populate("category")
    res.json(books)
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// פונקציה לקבלת ספר ספציפי לפי מזהה, כולל פרטי הקטגוריה שלו, מהמסד נתונים
export const getBookById = async (req: Request, res: Response) => {
  try {
    //populate מביא את פרטי הקטגוריה
    const book = await Book.findById(req.params.id).populate("category");
    if (!book) 
        return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
// פונקציה ליצירת ספר חדש במסד נתונים
export const createBook = async (req: Request, res: Response) => {
  try {
    const categoryId = await resolveCategoryId(req.body.category);
    const payload = {
      ...req.body,
      category: categoryId,
    };
    const book = await Book.create(payload);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
  }
};
// פונקציה לעדכון ספר קיים במסד נתונים לפי מזהה
export const updateBook = async (req: Request, res: Response) => {
  try {
    const payload: Record<string, unknown> = { ...req.body };
    if (req.body.category !== undefined) {
      payload.category = await resolveCategoryId(req.body.category);
    }

    const book = await Book.findByIdAndUpdate(req.params.id, payload, {
      new: true,
    });
    if (!book)
         return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
  }
};

// פונקציה למחיקת ספר קיים במסד נתונים לפי מזהה
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
