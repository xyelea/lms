"use client";

import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Attachment, Course } from "@prisma/client";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] }; // Data awal yang berisi kursus dan lampiran-lampirannya
  courseId: string; // ID kursus
}
// Skema validasi untuk formulir
const formSchema = z.object({ url: z.string().min(1) });

export default function AttachmentForm({
  initialData,
  courseId,
}: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false); // State untuk menentukan apakah sedang dalam mode pengeditan
  const [deletingId, setIsDeletingId] = useState<string | null>(null); // State untuk menandai id lampiran yang sedang dihapus
  // Fungsi untuk beralih antara mode pengeditan
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter(); // Hook router Next.js
  // Fungsi untuk menangani pengiriman data lampiran baru
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values); // Kirim permintaan POST untuk menambahkan lampiran
      toast.success("course di perbarui."); // Tampilkan pemberitahuan sukses
      toggleEdit(); // Keluar dari mode pengeditan
      router.refresh(); // Perbarui halaman
    } catch (error) {
      toast.error("Terjadi kesalahan"); // Tampilkan pemberitahuan kesalahan jika terjadi kesalahan
    }
  };
  // Fungsi untuk menangani penghapusan lampiran

  const onDelete = async (id: string) => {
    try {
      setIsDeletingId(id); // Set id lampiran yang sedang dihapus
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`); // Kirim permintaan DELETE untuk menghapus lampiran
      toast.success("berhasil menghapus file"); // Tampilkan pemberitahuan sukses
      router.refresh(); // Perbarui halaman
    } catch (error) {
      toast.error("gagal menghapus file!"); // Tampilkan pemberitahuan kesalahan jika terjadi kesalahan
    } finally {
      setIsDeletingId(null); // Set id lampiran yang sedang dihapus kembali menjadi null setelah selesai
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lampiran course
        {/* Tombol untuk mengaktifkan atau menonaktifkan mode pengeditan */}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Batalkan</>}
          {/* Tampilan tombol saat tidak dalam mode pengeditan */}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah lampiran {/* Teks tombol untuk menambahkan lampiran */}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              Belum ada lampiran
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 text-sky-700 rounded-md">
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{attachment.name}</p>{" "}
                  {/* Tombol untuk menghapus lampiran */}
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Tambahkan lampiran apapun yang mungkin dibutuhkan pada course.
          </div>
        </div>
      )}
    </div>
  );
}
