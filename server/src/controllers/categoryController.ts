import { Request, Response } from "express";
import Category from "../models/Category";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) 
        return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) 
        return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
