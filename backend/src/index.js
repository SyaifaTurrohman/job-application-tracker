import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import applicationsRouter from './routes/applications.js';
import notesRouter from './routes/notes.js';

const app = express();

// Middleware: bagian ini jalan di SETIAP request sebelum sampai ke route
app.use(cors());        // izinkan React (beda port) mengakses API ini
app.use(express.json()); // parsing body request JSON otomatis

// Route sederhana untuk memastikan server hidup
app.get('/', (req, res) => {
  res.json({ message: 'Job Tracker API is running' });
});

// Semua route yang diawali /api/applications ditangani oleh applicationsRouter
app.use('/api/applications', applicationsRouter);
app.use('/api', notesRouter); // notesRouter sudah handle path lengkapnya sendiri

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
