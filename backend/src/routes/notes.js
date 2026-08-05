import express from 'express';
import prisma from '../prisma.js';

const router = express.Router();

// GET /api/applications/:appId/notes — semua notes milik satu application
router.get('/applications/:appId/notes', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { applicationId: Number(req.params.appId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data notes' });
  }
});

// POST /api/applications/:appId/notes — tambah note baru ke suatu application
router.post('/applications/:appId/notes', async (req, res) => {
  try {
    const { content, type, reminderDate } = req.body;
    const applicationId = Number(req.params.appId);

    if (!content) {
      return res.status(400).json({ error: 'content wajib diisi' });
    }

    // Pastikan application-nya beneran ada sebelum bikin note
    const applicationExists = await prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!applicationExists) {
      return res.status(404).json({ error: 'Application tidak ditemukan' });
    }

    const note = await prisma.note.create({
      data: {
        content,
        type: type || 'INTERVIEW_NOTE',
        reminderDate: reminderDate ? new Date(reminderDate) : null,
        applicationId,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat note' });
  }
});

// PUT /api/notes/:id — update note
router.put('/notes/:id', async (req, res) => {
  try {
    const { content, type, reminderDate } = req.body;

    const note = await prisma.note.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(content && { content }),
        ...(type && { type }),
        ...(reminderDate !== undefined && {
          reminderDate: reminderDate ? new Date(reminderDate) : null,
        }),
      },
    });

    res.json(note);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Note tidak ditemukan' });
    }
    res.status(500).json({ error: 'Gagal update note' });
  }
});

// DELETE /api/notes/:id — hapus note
router.delete('/notes/:id', async (req, res) => {
  try {
    await prisma.note.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Note tidak ditemukan' });
    }
    res.status(500).json({ error: 'Gagal menghapus note' });
  }
});

export default router;
