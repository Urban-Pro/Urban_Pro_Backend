import { Telegraf } from 'telegraf';
import fs from 'fs';

const telegram = async (req, res) => {
  // Obtener la lista de archivos cargados en la solicitud
  const files = req.files;

  // Enviar cada archivo al canal privado de Telegram
  const bot = new Telegraf("6065278775:AAFJBA75YuCA3shPRbfxkoiFKXpi1njmHI8");
  try {
    const promises = files.map(async (file) => {
      await bot.telegram.sendDocument(
        req.body.telegram,
        { source: file.path },
        { caption: req.body.nombre + "\n" + req.body.email }
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

    res.json({ message: "Archivos cargados correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al cargar los archivos" });
  }
};

export default telegram;