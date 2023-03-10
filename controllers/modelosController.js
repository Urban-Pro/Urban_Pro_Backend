import Usuario from "../models/Usuario.js";

const obtenerModelos = async (req, res) => {
  try {
    const modelos = await Usuario.find({ });
    console.log(modelos);
    res.json(modelos);
  } catch (error) {
    console.log("Error al obtener modelos: ", error.message);
    res.status(500).json({ message: "Error al obtener modelos" });
  }
};

const obtenerModelo = async (req, res) => {
  const { id } = req.params;

  const modelo = await Usuario.findById(id)

  if (!modelo) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  res.json(modelo);
};

const editarModelo = async (req, res) => {
  const { id } = req.params;

  const modelo = await Usuario.findById(id);
  console.log(modelo);

  if (!modelo) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  modelo.nombre = req.body.nombre || modelo.nombre;
  modelo.email = req.body.email || modelo.email;
  modelo.telegram = req.body.telegram || modelo.telegram;

  try {
    const modeloAlmacenado = await modelo.save();
    res.json(modeloAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarModelo = async (req, res) => {
  const { id } = req.params;

  try {
    const modelo = await Usuario.findById(req.params.id);

    if (!modelo) {
      const error = new Error("No Encontrado");
      return res.status(404).json({ msg: error.message });
    }

    await modelo.deleteOne();
    res.json({ msg: "modelo Eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error al eliminar el modelo" });
  }
};


export {
  obtenerModelos,
  obtenerModelo,
  editarModelo,
  eliminarModelo
};