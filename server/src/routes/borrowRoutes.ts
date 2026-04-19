import { Router } from "express";
import {getAllBorrows,borrowBook,returnBook,getUserBorrows} from "../controllers/borrowController";

const router = Router();

router.get("/", getAllBorrows); 
router.post("/", borrowBook); 
router.put("/return/:id", returnBook); 
router.get("/user/:userId", getUserBorrows); 

export default router;
