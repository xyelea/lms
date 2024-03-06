// Dua fungsi ini digunakan untuk menghasilkan komponen tombol unggah (UploadButton) dan zona unggah (UploadDropzone)
// dengan konfigurasi yang telah ditentukan dalam router file (OurFileRouter) yang didefinisikan dalam core uploadthing.

import {
  generateUploadButton, // Impor fungsi generateUploadButton dari modul @uploadthing/react untuk membuat komponen tombol unggah.
  generateUploadDropzone, // Impor fungsi generateUploadDropzone dari modul @uploadthing/react untuk membuat komponen zona unggah.
} from "@uploadthing/react"; // Impor modul @uploadthing/react yang menyediakan fungsi untuk membuat komponen unggah.

import type { OurFileRouter } from "@/app/api/uploadthing/core"; // Impor tipe OurFileRouter dari core uploadthing untuk digunakan dalam generasi komponen.

// Membuat komponen UploadButton dengan konfigurasi yang ditentukan dalam OurFileRouter.
export const UploadButton = generateUploadButton<OurFileRouter>();
// Membuat komponen UploadDropzone dengan konfigurasi yang ditentukan dalam OurFileRouter.
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
