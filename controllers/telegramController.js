import { Telegraf } from 'telegraf';
import fs from 'fs';

const telegram = async (req, res) => {
  // Verificar que se hayan cargado archivos en la solicitud
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No se han cargado archivos" });
  }

  // Verificar que se haya especificado un canal de Telegram válido
  if (!req.body.telegram) {
    return res.status(400).json({ message: "No se ha especificado un canal de Telegram" });
  }

  // Enviar cada archivo al canal privado de Telegram
  const bot = new Telegraf("TOKEN_DE_TELEGRAM");
  try {
    const promises = req.files.map(async (file) => {
      // Verificar que el archivo se haya cargado correctamente
      if (!fs.existsSync(file.path)) {
        console.error(`El archivo ${file.originalname} no se ha cargado correctamente`);
        return;
      }

      // Enviar el archivo a Telegram con opciones personalizadas
      await bot.telegram.sendDocument(
        req.body.telegram,
        { source: file.path },
        {
          caption: `${req.body.nombre}\n${req.body.email}`,
          thumb: { source: file.path },
          filename: file.originalname,
          disable_notification: true
        }
      );

      // Eliminar el archivo cargado una vez que se ha enviado a Telegram
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo ${file.originalname}: ${err}`);
        }
      });
    });
    await Promise.all(promises);

    res.json({ message: "Archivos cargados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cargar los archivos" });
  }
};

export default telegram;