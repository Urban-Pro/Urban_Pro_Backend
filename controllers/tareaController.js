import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import { allowNotification, emailChat, emailNotificacionTarea } from "../helpers/email.js";

const agregarTarea = async (req, res) => {
  const { proyecto, colaboradores } = req.body;

  const existeProyecto = await Proyecto.findById(proyecto);

  if (!existeProyecto) {
    const error = new Error("El Proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }

  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos para añadir tareas");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    // Almacenar el ID en el proyecto
    existeProyecto.tareas.push(tareaAlmacenada._id);
    await existeProyecto.save();

    // Enviar el email de notificación a los colaboradores
    colaboradores.forEach((colaborador) => {
      emailNotificacionTarea({
        email: colaborador.email,
        tarea: tareaAlmacenada,
      });
    });

    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al agregar tarea" });
  }
};

const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  res.json(tarea);
};

const actualizarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

  try {
    const tareaAlmacenada = await tarea.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al actualizar tarea" });
  }
};

const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const proyecto = await Proyecto.findById(tarea.proyecto);
    proyecto.tareas.pull(tarea._id);
    await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);
    res.json({ msg: "La Tarea se eliminó" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al eliminar tarea" });
  }
};

const cambiarEstado = async (req, res) => {
  const { id } = req.params;

  const tarea = await Tarea.findById(id).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (
    tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
    !tarea.proyecto.colaboradores.some(
      (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )
  ) {
    const error = new Error("Acción no válida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.estado = !tarea.estado;
  tarea.completado = req.usuario._id;
  await tarea.save();

  const tareaAlmacenada = await Tarea.findById(id)
    .populate("proyecto")
    .populate("completado");

  res.json(tareaAlmacenada);

  // Enviar el email de notificación de cambio de estado
  tarea.proyecto.colaboradores.forEach((colaborador) => {
    emailNotificacionTarea({
      email: colaborador.email,
      tarea: tareaAlmacenada,
    });
  });
};

const emailChatF = async (req, res) => {
  try {
    // Enviar el email de chat
    emailChat({
      to: req.body.to,
      subject: req.body.subject,
      message: req.body.message,
      email: req.body.email,
      typeAccount: req.body.typeAccount,
      emailCreador: req.body.emailCreador
    });

    res.json({
      msg: "chat enviado correctamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al enviar chat" });
  }
};

export {
  emailChatF,
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};