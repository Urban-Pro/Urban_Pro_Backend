import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import multer from "multer";
import Telegraf from "telegraf";
import { Server } from "socket.io";
import http from "http";

const app = express();

app.use(express.json());

dotenv.config();

conectarDB();

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      // No esta permitido
      callback(new Error("Error de Cors"));
    }
  },
};

app.use(cors(corsOptions));

// Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;
const servidor = http.createServer(app);

const io = new Server(servidor, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  console.log("Usuario conectado a socket.io");

  // Definir los eventos de socket io
  socket.on("abrir proyecto", (proyecto) => {
    socket.join(proyecto);
  });

  socket.on("nueva tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea agregada", tarea);
  });

  socket.on("eliminar tarea", (tarea) => {
    const proyecto = tarea.proyecto;
    socket.to(proyecto).emit("tarea eliminada", tarea);
  });

  socket.on("actualizar tarea", (tarea) => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("tarea actualizada", tarea);
  });

  socket.on("cambiar estado", (tarea) => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit("nuevo estado", tarea);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado de socket.io");
  });
});

servidor.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Configurar Telegram Bot API
const bot = new Telegraf("6065278775:AAFJBA75YuCA3shPRbfxkoiFKXpi1njmHI8");
bot.startPolling();

// Manejar solicitud de carga de archivo
app.post("/upload", multer({ dest: "uploads/" }).single("file"), (req, res) => {
  const { file } = req;
  // Enviar el archivo al canal privado en Telegram
  bot.telegram.sendDocument("-1001476325427", { source: file.path });
  // Eliminar el archivo temporal después de enviarlo
  fs.unlink(file.path, (error) => {
    if (error) console.log(error);
  });
  res.send("Archivo cargado y enviado a Telegram");
});