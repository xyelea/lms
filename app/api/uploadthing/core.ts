// Mengimpor modul-modul yang diperlukan dari pustaka dan package yang sesuai
import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

// Membuat instance Uploadthing
const f = createUploadthing();

// Fungsi untuk menangani otentikasi
const handleAuth = () => {
  // Mendapatkan userId dari objek autentikasi Clerk
  const { userId } = auth();
  // Jika userId tidak tersedia, lemparkan error "Unauthorized"
  if (!userId) throw new Error("Unauthorized");
  // Mengembalikan objek userId
  return { userId };
};

// Definisi router untuk berbagai jenis file
export const ourFileRouter = {
  // Router untuk gambar kursus dengan batasan ukuran file dan jumlah file
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // Middleware untuk memeriksa otentikasi pengguna sebelum mengunggah file
    .middleware(() => handleAuth())
    // Callback yang dipanggil ketika unggahan selesai
    .onUploadComplete(() => {}),
  // Router untuk lampiran kursus dengan jenis file yang diizinkan dan otentikasi
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  // Router untuk video bab dengan batasan ukuran file
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

// Tipe untuk router file kustom
export type OurFileRouter = typeof ourFileRouter;
