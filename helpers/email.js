import nodemailer from "nodemailer";
                       
export const allowNotification = async (datos) => {
  const { email, descripcion } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  // Información del email

  if (datos.estado == false) {

  const info = await transport.sendMail({
    from: '"Urban Pro App - Administrador de Modelos" <urbanproapp@outlook.com>',
    to: "urbanproapp@outlook.com",
    subject: `${email}, Acepto el pedido!`,
    text: "Urban Pro App, te notifica un pedido Aceptado!",
    html: `<p>Pedido: ${descripcion}</p>
    `,
  });
    
  } else {
    const info = await transport.sendMail({
      from: '"Urban Pro App - Administrador de Modelos" <urbanproapp@outlook.com>',
      to: email,
      subject: `Cancelaste el pedido`,
      text: "Urban Pro App, te notifica que cancelaste el pedido!",
      html: `<p>El pedido fue:</p>
      <p>${descripcion}
      `,
    });
  }
};

export const emailNotificaciònTarea = async (datos) => {
  const { email } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email

  const info = await transport.sendMail({
    from: '"Urban Pro App - Administrador de Modelos" <urbanproapp@outlook.com>',
    to: email,
    subject: "Urban Pro App - Tarea Nueva",
    text: "Urban Pro App, te notifica una tarea nueva!",
    html: `<p>Hola: Urban Pro ha preparado esta tarea para ti.</p>
    <p>Podras iniciar tu tarea tan pronto entres a Urban Pro App:

    <a href="https://urbanproapp.online/">Ingresa a tu Cuenta y activa tu tarea.</a>
    
    
    `,
  });
};

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email

  const info = await transport.sendMail({
    from: '"Urban Pro App - Administrador de Modelos" <urbanproapp@outlook.com>',
    to: email,
    subject: "Urban Pro App - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en Urban Pro App",
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en Urban Pro App</p>
    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace: 

    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
    
    <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
    
    
    `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Información del email

  const info = await transport.sendMail({
    from: '"Urban Pro App - Administrador de Modelos" <urbanproapp@outlook.com>',
    to: email,
    subject: "Urban Pro App - Reestablece tu Password",
    text: "Reestablece tu Password",
    html: `<p>Hola: ${nombre} has solicitado reestablecer tu password</p>

    <p>Sigue el siguiente enlace para generar un nuevo password: 

    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
    
    <p>Si tu no solicitaste este email, puedes ignorar el mensaje</p>
    
    
    `,
  });
};
