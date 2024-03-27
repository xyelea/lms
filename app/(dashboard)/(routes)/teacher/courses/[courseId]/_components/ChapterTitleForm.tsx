"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

/**
 * Komponen Form untuk mengubah judul chapter
 * @param initialData Data awal judul chapter
 * @param courseId ID kursus terkait
 * @param chapterId ID chapter yang akan diubah judulnya
 */

interface ChapterTitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
  chapterId: string;
}

// Skema validasi untuk form
const formSchema = z.object({
  title: z.string().min(1),
});

export default function ChapterTitleForm({
  initialData,
  courseId,
  chapterId,
}: ChapterTitleFormProps) {
  // State untuk menentukan apakah sedang dalam mode editing atau tidak
  const [isEditing, setIsEditing] = useState(false);

  // Fungsi untuk toggle mode editing
  const toggleEdit = () => setIsEditing((current) => !current);

  // Hook router Next.js
  const router = useRouter();

  // Hook useForm dari react-hook-form untuk mengelola form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Mengekstrak informasi dari formState
  const { isSubmitting, isValid } = form.formState;

  // Handler saat form disubmit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Melakukan PATCH request ke endpoint untuk mengubah judul chapter
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      // Menampilkan pesan sukses
      toast.success("Chapter di perbarui");
      // Menutup mode editing
      toggleEdit();
      // Me-refresh halaman untuk memperbarui data
      router.refresh();
    } catch (error) {
      // Menampilkan pesan error jika terjadi kesalahan
      toast.error("Terjadi kesalahan");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Judul chapter
        {/* Tombol untuk memulai atau membatalkan mode editing */}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Title
            </>
          )}
        </Button>
      </div>
      {/* Menampilkan judul chapter jika tidak sedang dalam mode editing */}
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {/* Menampilkan form editing jika sedang dalam mode editing */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
            {/* Field input untuk judul chapter */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* Input untuk judul chapter */}
                    <Input
                      disabled={isSubmitting}
                      placeholder="contoh : Pengenalan HTML"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              {/* Tombol untuk menyimpan perubahan */}
              <Button disabled={!isValid || isSubmitting} type="submit">
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
