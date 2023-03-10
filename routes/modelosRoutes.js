import express from "express";

import {obtenerModelos, editarModelo, obtenerModelo, eliminarModelo} from "../controllers/modelosController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, obtenerModelos)

router
  .route("/:id")
  .get(checkAuth, obtenerModelo)
  .put(checkAuth, editarModelo)
  .delete(checkAuth, eliminarModelo);

export default router;
