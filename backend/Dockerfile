# Base image: Node.js versi LTS, "alpine" = versi ringan/kecil
FROM node:20-alpine

WORKDIR /app

# Copy package.json dulu SEBELUM copy source code lainnya.
# Trik ini memanfaatkan Docker layer caching: kalau dependencies nggak berubah,
# Docker nggak perlu install ulang tiap kali source code diedit — build jadi jauh lebih cepat.
COPY package*.json ./
COPY prisma ./prisma

RUN npm install

# Generate Prisma Client — wajib dilakukan setelah schema ter-copy
RUN npx prisma generate

# Baru copy sisa source code
COPY . .

EXPOSE 5000

# Saat container start: jalankan migration dulu (biar tabel selalu up to date),
# baru start server-nya
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
