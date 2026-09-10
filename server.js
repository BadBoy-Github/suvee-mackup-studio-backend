import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import contactRoutes from './routes/contact.js';
import serviceRoutes from './routes/services.js';
import workRoutes from './routes/works.js';
import reviewRoutes from './routes/reviews.js';
import authRoutes from './routes/auth.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
