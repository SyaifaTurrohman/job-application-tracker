import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// GET /api/applications — ambil semua lamaran, urut dari yang terbaru
router.get('/', async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data applications' });
  }
});

// GET /api/applications/:id — ambil satu lamaran beserta notes-nya
router.get('/:id', async (req, res) => {
  try {
    const application = await prisma.application.findUnique({
      where: { id: Number(req.params.id) },
      include: { notes: true }, // sertakan relasi notes
    });

    if (!application) {
      return res.status(404).json({ error: 'Application tidak ditemukan' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data application' });
  }
});

// POST /api/applications — tambah lamaran baru
router.post('/', async (req, res) => {
  try {
    const { company, position, status, jobUrl, appliedDate } = req.body;

    // Validasi sederhana: company & position wajib diisi
    if (!company || !position) {
      return res.status(400).json({ error: 'company dan position wajib diisi' });
    }

    const application = await prisma.application.create({
      data: {
        company,
        position,
        status: status || 'APPLIED',
        jobUrl,
        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error); // tampilkan detail error di terminal
    res.status(500).json({ error: 'Gagal membuat application' });
  }
});

// PUT /api/applications/:id — update lamaran
router.put('/:id', async (req, res) => {
  try {
    const { company, position, status, jobUrl, appliedDate } = req.body;

    const application = await prisma.application.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(company && { company }),
        ...(position && { position }),
        ...(status && { status }),
        ...(jobUrl !== undefined && { jobUrl }),
        ...(appliedDate && { appliedDate: new Date(appliedDate) }),
      },
    });

    res.json(application);
  } catch (error) {
    if (error.code === 'P2025') {
      // Kode error khusus Prisma: record tidak ditemukan
      return res.status(404).json({ error: 'Application tidak ditemukan' });
    }
    res.status(500).json({ error: 'Gagal update application' });
  }
});

// DELETE /api/applications/:id — hapus lamaran (notes ikut terhapus karena onDelete: Cascade)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.application.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send(); // 204 = berhasil, tidak ada konten dikembalikan
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Application tidak ditemukan' });
    }
    res.status(500).json({ error: 'Gagal menghapus application' });
  }
});

export default router;
