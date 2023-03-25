import { Telegraf } from 'telegraf';
import fs from 'fs';

/**
 * Función que envía archivos cargados en una solicitud HTTP al canal privado de Telegram
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @returns {void}
 */
const telegram = async (req, res) => {
  try {
    // Obtener la lista de archivos cargados en la solicitud
    const files = req.files;

    // Enviar cada archivo al canal privado de Telegram
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    const promises = files.map(async (file) => {
      await bot.telegram.sendDocument(
        req.body.telegram,
        { source: file.path },
        { caption: `${req.body.nombre}\n${req.body.email}` }
      );
    });
    await Promise.all(promises);

    // Eliminar los archivos cargados una vez que se han enviado a Telegram
    files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(err);
        }
      });
    });

    // Responder con un mensaje de éxito
    res.json({ message: "Archivos cargados correctamente" });
  } catch (error) {
    console.error(error);
    // Responder con un mensaje de error
    res.status(500).json({ message: "Error al cargar los archivos" });
  }
};

export default telegram;