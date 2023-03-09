import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";
import multer from "multer";
import { Telegraf } from 'telegraf';

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

// Configurar multer
const upload = multer({ dest: "uploads/" }).array("archivos");

// Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

app.post("/api/upload", upload, (req, res) => {
  console.log("upload")
  const files = req.files;
  console.log(files); // Agregar este mensaje de registro

  // Enviar los archivos al canal privado de Telegram
  const bot = new Telegraf("6065278775:AAFJBA75YuCA3shPRbfxkoiFKXpi1njmHI8");
  Promise.all(
    files.map((file) =>
      bot.telegram.sendDocument(
        "-1001834953656",
        { source: file.path },
        { caption: "Nuevo archivo cargado" }
      )
    )
  )
    .then(() => {
      res.json({ message: "Archivos cargados correctamente" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error al cargar los archivos" });
    });
});

const PORT = process.env.PORT || 4000;
const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Socket.io
import { Server } from "socket.io";

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  // console.log("Conectado a socket.io");

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
});