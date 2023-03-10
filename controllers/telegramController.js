import { Telegraf } from 'telegraf';

const telegram = (req, res) => {
    console.log(req.body);
    const file = req.file;
    console.log(file); // Agregar este mensaje de registro
  
    // Enviar el archivo al canal privado de Telegram
    const bot = new Telegraf("6065278775:AAFJBA75YuCA3shPRbfxkoiFKXpi1njmHI8");
    bot.telegram
      .sendDocument(
        "-1001834953656",
        { source: file.path },
        { caption: "Nuevo archivo cargado" }
      )
      .then(() => {
        res.json({ message: "Archivo cargado correctamente" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Error al cargar el archivo" });
      });
  };

  export {
    telegram
  };