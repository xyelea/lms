"use client";

// Komponen FileUpload bertanggung jawab untuk menampilkan zona unggah file dan menangani logika unggah file.
import toast from "react-hot-toast"; // Impor modul react-hot-toast untuk menampilkan notifikasi.

import { UploadDropzone } from "@/lib/uploadthing"; // Impor komponen UploadDropzone untuk membuat zona unggah file.
import { ourFileRouter } from "@/app/api/uploadthing/core"; // Impor router file yang didefinisikan dalam core uploadthing.

interface FileUploadProps {
  onChange: (url?: string) => void; // Fungsi callback onChange untuk mengembalikan URL file yang diunggah.
  endpoint: keyof typeof ourFileRouter; // Titik akhir (endpoint) yang akan digunakan untuk mengunggah file.
}

// Komponen FileUpload menerima prop onChange dan endpoint.
export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    // UploadDropzone digunakan untuk membuat zona unggah file.
    <UploadDropzone
      endpoint={endpoint} // Prop endpoint digunakan untuk menentukan endpoint yang akan digunakan untuk mengunggah file.
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }} // Fungsi callback onClientUploadComplete dipanggil ketika unggah file dari klien berhasil.
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }} // Fungsi callback onUploadError dipanggil ketika terjadi kesalahan saat unggah file.
    />
  );
};
