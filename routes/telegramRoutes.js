import express from "express";
const router = express.Router();
import { telegram } from "../controllers/telegramController.js";

// Telegram API
router.post("/", telegram ); // Manejar Entrada Telegram

export default router;
