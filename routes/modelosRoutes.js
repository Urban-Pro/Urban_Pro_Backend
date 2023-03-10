import express from "express";

import obtenerModelos from "../controllers/modelosController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/", checkAuth, obtenerModelos)

export default router;
