
import { UpNotificationEmail } from "../helpers/email.js";

const UpNotification = async (req, res) => {
    console.log(req.body)

    try {
        // Enviar Email con Urls Dde Firebase        
        UpNotificationEmail({
            to: req.body.to,
            subject: req.body.subject,
            message: req.body.message,
            email: req.body.email
        });
        
    } catch (error) {
        console.log(error);
    }

}

export default UpNotification