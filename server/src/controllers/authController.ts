import { Request, Response } from "express";
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
import User from "../models/User";
// ייבוא המודלים והספריות הדרושות לניהול האימות והרישום של משתמשים
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }
// הצפנה של הסיסמא
    const hashed = await bcrypt.hash(password, 10);
// יוצר משתמש
    const user = await User.create({
      fullName,
      email,
      password: hashed
    });

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// פונקציה לרישום משתמשים חדשים, 
// הכוללת בדיקה אם האימייל כבר קיים
// , הצפנת הסיסמה ושמירת המשתמש במסד הנתונים
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) 
        return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) 
        return res.status(400).json({ message: "Invalid credentials" });
// יצירת טוקן JWT עם מזהה המשתמש ותפקידו
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
// התחברות למערכת והחזרת הטוקן ופרטי המשתמש
    res.json({
      message: "Logged in",
      token,
      user: {
        id: user._id,
        name: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
