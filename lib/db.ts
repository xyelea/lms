import { PrismaClient } from "@prisma/client"; // Import PrismaClient dari pustaka Prisma

// Deklarasi global untuk PrismaClient
declare global {
  var prisma: PrismaClient | undefined; // Variabel global prisma dengan tipe PrismaClient atau undefined
}

// Inisialisasi variabel db sebagai instance dari PrismaClient atau menggunakan instance yang sudah ada jika tersedia
export const db = globalThis.prisma || new PrismaClient();

// Jika aplikasi berjalan dalam lingkungan pengembangan, atur variabel global prisma ke nilai db
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
