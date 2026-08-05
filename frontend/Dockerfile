FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host 0.0.0.0 WAJIB di dalam Docker, supaya Vite dev server bisa diakses
# dari LUAR container (dari browser di komputer kamu), bukan cuma dari dalam container itu sendiri
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
