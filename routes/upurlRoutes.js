import express from "express";
import telegram from "../controllers/telegramController.js";
import upload from "../controllers/uploadController.js";

const router = express.Router();

// Telegram API
router.post("/files", telegram ); // Manejar Entrada Telegram
router.post("/upload", upload ); // Manejar Entrada Upload Notification

export default router;