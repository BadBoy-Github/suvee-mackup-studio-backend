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
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nContext: ${context}\nMessage: ${message}`
    });

    res.status(201).json({ success: true, message: 'Contact submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
