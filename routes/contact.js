import express from 'express';
import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const buildEmailHtml = (name, email, phone, context, message) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Submission - Suvee Makeup Studios</title>
</head>
<body style="margin:0; padding:0; background-color:#fdf6e3; font-family: 'Inter', system-ui, -apple-system, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fdf6e3; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow: 0 10px 40px rgba(85, 107, 47, 0.15);">
          <tr>
            <td style="background: linear-gradient(135deg, #556b2f 0%, #6b8e4e 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Suvee Makeup Studios</h1>
              <p style="margin: 8px 0 0; color: #f7d86c; font-size: 14px; font-weight: 500;">Bridal Makeup in Erode, Tamil Nadu</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom: 24px; border-bottom: 2px solid #f5e6d3;">
                    <h2 style="margin: 0 0 8px; color: #556b2f; font-size: 20px; font-weight: 700;">New Contact Submission</h2>
                    <p style="margin: 0; color: #6b8e4e; font-size: 14px; font-weight: 600; background-color: #fdf6e3; display: inline-block; padding: 6px 14px; border-radius: 20px;">${context}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding: 16px; background-color: #fdf6e3; border-radius: 16px; border-left: 4px solid #f4c430;">
                          <p style="margin: 0 0 4px; color: #6b8e4e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                          <p style="margin: 0; color: #3e4f22; font-size: 16px; font-weight: 600;">${name}</p>
                        </td>
                      </tr>
                      <tr><td style="height: 12px;"></td></tr>
                      <tr>
                        <td style="padding: 16px; background-color: #fdf6e3; border-radius: 16px; border-left: 4px solid #f4c430;">
                          <p style="margin: 0 0 4px; color: #6b8e4e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                          <p style="margin: 0; color: #3e4f22; font-size: 16px; font-weight: 600;">${email}</p>
                        </td>
                      </tr>
                      <tr><td style="height: 12px;"></td></tr>
                      <tr>
                        <td style="padding: 16px; background-color: #fdf6e3; border-radius: 16px; border-left: 4px solid #f4c430;">
                          <p style="margin: 0 0 4px; color: #6b8e4e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Phone</p>
                          <p style="margin: 0; color: #3e4f22; font-size: 16px; font-weight: 600;">${phone}</p>
                        </td>
                      </tr>
                      <tr><td style="height: 12px;"></td></tr>
                      <tr>
                        <td style="padding: 16px; background-color: #fdf6e3; border-radius: 16px; border-left: 4px solid #f4c430;">
                          <p style="margin: 0 0 4px; color: #6b8e4e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                          <p style="margin: 0; color: #3e4f22; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f5e6d3; padding: 24px; text-align: center;">
              <p style="margin: 0; color: #556b2f; font-size: 13px; font-weight: 600;">Suvee Makeup Studios</p>
              <p style="margin: 6px 0 0; color: #6b8e4e; font-size: 12px;">Erode, Tamil Nadu, India</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, context, message } = req.body;

    const contact = new Contact({ name, email, phone, context, message });
    await contact.save();

    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Submission - ${context}`,
      html: buildEmailHtml(name, email, phone, context, message)
    });

    res.status(201).json({ success: true, message: 'Contact submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
