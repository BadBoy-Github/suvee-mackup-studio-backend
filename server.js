import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import contactRoutes from './routes/contact.js';
import serviceRoutes from './routes/services.js';
import workRoutes from './routes/works.js';
import reviewRoutes from './routes/reviews.js';
import authRoutes from './routes/auth.js';
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
    ].filter(Boolean).map(o => o.replace(/\/$/, ''));

    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Suvee Mackup Studios and Academy API' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/contact', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/works', workRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
});

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) return;

    const existing = await Admin.findOne({ email: adminEmail });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await Admin.create({ email: adminEmail, password: hashedPassword });
      console.log('Admin user seeded');
    }
  } catch (error) {
    console.error('Admin seeding error:', error);
  }
};

seedAdmin();

export default app;

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
