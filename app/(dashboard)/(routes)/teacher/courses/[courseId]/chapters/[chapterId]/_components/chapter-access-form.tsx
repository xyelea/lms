"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ChapterAccessFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false),
});
/**
 * Komponen untuk mengelola akses chapter.
 *
 * @param initialData Data awal chapter.
 * @param courseId ID kursus yang terkait dengan chapter.
 * @param chapterId ID chapter yang akan diakses.
 */
export default function ChapterAccessForm({
  initialData,
  courseId,
  chapterId,
}: ChapterAccessFormProps) {
  // State untuk mengatur mode editing
  const [isEditing, setIsEditing] = useState(false);

  // Fungsi untuk toggle mode editing
  const toggleEdit = () => setIsEditing((current) => !current);

  // Hook router Next.js untuk navigasi
  const router = useRouter();

  // Hook useForm untuk mengatur form dan validasi menggunakan Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree, // Menetapkan nilai default isFree dari initialData
    },
  });
  // State isSubmitting dan isValid dari form
  const { isSubmitting, isValid } = form.formState;

  // Fungsi untuk menangani submit form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Mengirim data perubahan ke server menggunakan HTTP PATCH
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      // Menampilkan notifikasi sukses
      toast.success("Akses chapter di perbarui");
      // Mengubah mode editing menjadi false dan merefresh halaman
      toggleEdit();
      router.refresh();
    } catch (error) {
      // Menampilkan notifikasi kesalahan jika terjadi kesalahan
      toast.error("Terjadi kesalahan");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Akses chapter
        {/* Tombol untuk toggle mode editing */}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing ? (
            <>Batal</> // Jika sedang dalam mode editing, tampilkan tombol Batal
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit akses
            </>
          )}
        </Button>
      </div>
      {/* Tampilan non-editing mode */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.isFree && "text-slate-500 italic"
          )}>
          {initialData.isFree ? (
            <>Chapter ini bebas untuk di lihat</> // Jika chapter gratis, tampilkan pesan ini
          ) : (
            <>Chapter ini berbayar</> // Jika chapter berbayar, tampilkan pesan ini
          )}
        </p>
      )}
      {/* Tampilan editing mode */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
            {/* Form field untuk mengatur isFree menggunakan checkbox */}
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    {/* Deskripsi untuk checkbox */}
                    <FormDescription>
                      Centang bila anda ingin membuat chapter ini gratis untuk
                      dilihat
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              {/* Tombol Simpan */}
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
