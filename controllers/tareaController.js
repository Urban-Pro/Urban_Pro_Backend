import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import { allowNotification, emailChat } from "../helpers/email.js";

const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;

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
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }

  const {colaboradores} = req.body
  try {
    const array = colaboradores.map((colaboradores) => {    // Enviar el email de confirmacion
      emailNotificaciònTarea({
        email: colaboradores.email
      });
  });
    res.json({
      msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta",
    });
  } catch (error) {
    console.log(error);
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
  }
};

const camTurn = async (req, res) => {
  console.log(req.body, "cambiando el estado")
  // el nuevo valor de "turn" está en el cuerpo de la solicitud
  const id = req.body.id;
  const turn = req.body.turn;
  console.log(id, turn)
  
  try {
    if (turn == false) {
        const updatedDoc = await Tarea.findOneAndUpdate(
          { _id: id }, // la condición para buscar el documento
          { turn: true }, // los valores a actualizar
          { new: true } // opcional, devuelve el documento actualizado en lugar del original
        );
        res.json(updatedDoc); 
    } else {
      const updatedDoc = await Tarea.findOneAndUpdate(
        { _id: id }, // la condición para buscar el documento
        { turn:false }, // los valores a actualizar
        { new: true } // opcional, devuelve el documento actualizado en lugar del original
      );
      res.json(updatedDoc);  
    }    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el documento" });
  }
}

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

/////// Envio de correo de notificaciòn de Allow o rechazado,cambio de estado

  try {
    // Enviar el email de confirmacion
    allowNotification({
      email: req.body.email,
      estado: req.body.estado,
      descripcion: req.body.descripcion
    });

    res.json({
      msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }

};

const emailChatF = async (req, res) => {
  console.log(req)

  const upturn = Tarea.findOneAndUpdate(req.body.turn)
  console.log(upturn)

  try {
    // Enviar el email de confirmacion
    emailChat({
      to: req.body.to,
      subject: req.body.subject,
      message: req.body.message,
      email: req.body.email,
      typeAccount: req.body.typeAccount,
      turn: req.body.turn
    });

    res.json({
      msg: "chat enviado correctamente",
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  camTurn,
  emailChatF,
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
