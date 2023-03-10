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


export default obtenerModelos