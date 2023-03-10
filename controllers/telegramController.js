import { Telegraf } from 'telegraf';
import Usuario from "../models/Usuario.js";

const telegram = async (req, res) => {
  console.log(req.file);
  const file = req.file;
  console.log(file); // Agregar este mensaje de registro

  // Enviar el archivo al canal privado de Telegram
  const bot = new Telegraf("6065278775:AAFJBA75YuCA3shPRbfxkoiFKXpi1njmHI8");
  try {
    await bot.telegram.sendDocument(
        Usuario.telegram,
      { source: file.path },
      { caption: "Nuevo archivo cargado" }
    );

    res.json({ message: "Archivo cargado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cargar el archivo" });
  }
};

export default telegram