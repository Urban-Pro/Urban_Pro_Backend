import express from "express";
import telegram from "../controllers/telegramController.js";

const router = express.Router();

// Telegram API
router.post("/files", telegram ); // Manejar Entrada Telegram

export default router;
