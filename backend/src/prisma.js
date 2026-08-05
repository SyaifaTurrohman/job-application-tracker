import { PrismaClient } from '@prisma/client';

// Satu instance PrismaClient dipakai di seluruh aplikasi.
// Kalau bikin instance baru di tiap file, bisa boros koneksi ke database.
const prisma = new PrismaClient();

export default prisma;
