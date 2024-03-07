"use client";

// Mengimpor modul-modul yang diperlukan dari pustaka dan package yang sesuai
import * as z from "zod";
import axios from "axios";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
// Definisi properti untuk komponen ImageForm
interface ImageFormProps {
  initialData: Course; // Data awal kursus
  courseId: string; // ID kursus
}

// Skema validasi untuk formulir gambar kursus menggunakan Zod
const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required", // Pesan kesalahan jika gambar tidak diunggah
  }),
});

// Komponen ImageForm untuk mengelola gambar kursus
export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  // State untuk mengontrol mode pengeditan
  const [isEditing, setIsEditing] = useState(false);

  // Fungsi untuk mengganti mode pengeditan
  const toggleEdit = () => setIsEditing((current) => !current);

  // Hook useRouter untuk mendapatkan objek router
  const router = useRouter();

  // Menangani pengiriman formulir
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Mengirim permintaan PATCH untuk memperbarui gambar kursus
      await axios.patch(`/api/courses/${courseId}`, values);
      // Menampilkan pesan sukses jika berhasil memperbarui
      toast.success("Course updated");
      // Mengubah mode pengeditan kembali ke tampilan biasa
      toggleEdit();
      // Me-refresh halaman menggunakan router
      router.refresh();
    } catch {
      // Menampilkan pesan kesalahan jika terjadi kesalahan
      toast.error("Something went wrong");
    }
  };

  // Mengembalikan tampilan Form untuk mengedit gambar kursus
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Thumbnail course
        {/* Tombol untuk mengaktifkan atau menonaktifkan mode pengeditan */}
        <Button onClick={toggleEdit} variant="ghost">
          {/* Tampilan tombol tergantung pada mode pengeditan */}
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {/* Tampilan gambar kursus */}
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {/* Formulir untuk mengedit atau mengunggah gambar kursus */}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          {/* Petunjuk tentang rasio aspek gambar yang direkomendasikan */}
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
