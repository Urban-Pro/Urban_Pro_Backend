import Usuario from "../models/Usuario.js";

const obtenerModelos = async (req, res) => {
  const modelos = await Usuario.find({ })
  res.json(modelos);
};

export default obtenerModelos