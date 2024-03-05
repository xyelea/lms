"use client";
// Komponen TitleForm digunakan untuk menampilkan judul course serta memungkinkan pengguna untuk mengedit judulnya.

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

// Props yang diterima oleh komponen TitleForm
interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

// Skema validasi untuk judul form menggunakan Zod
const formSchema = z.object({
  title: z.string().min(1, { message: "Title is Required" }),
});
// Fungsi utama komponen TitleForm
export default function TitleForm({ initialData, courseId }: TitleFormProps) {
  // State untuk menentukan apakah form sedang dalam mode editing atau tidak
  const [isEditing, setIsEditing] = useState(false);

  // Fungsi untuk mengubah mode editing
  const toggleEdit = () => setIsEditing((current) => !current);

  // Hook useRouter dari Next.js untuk mendapatkan objek router
  const router = useRouter();
  // Hook useForm dari react-hook-form untuk mengelola form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // Mengekstrak properti isSubmitting dan isValid dari formState untuk mengelola status form
  const { isSubmitting, isValid } = form.formState;

  // Fungsi untuk menangani submit form
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Mengirimkan permintaan PATCH ke API untuk memperbarui judul course
      await axios.patch(`/api/courses/${courseId}`, values);
      // Menampilkan notifikasi sukses jika berhasil memperbarui judul course
      toast.success("Course diperbarui");
      // Mengubah mode editing menjadi tidak
      toggleEdit();
      // Me-refresh halaman untuk menampilkan perubahan judul course yang baru
      router.refresh();
    } catch (error) {
      // Menampilkan notifikasi kesalahan jika terjadi kesalahan saat memperbarui judul course
      toast.error("Terjadi kesalahan");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Judul course
        <Button onClick={toggleEdit} variant={"ghost"}>
          {/* Tombol untuk mengubah mode editing */}
          {isEditing ? (
            <>cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit judul
            </>
          )}
        </Button>
      </div>
      {/* Tampilkan judul course jika tidak dalam mode editing */}
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {/* Tampilkan form untuk mengedit judul course jika dalam mode editing */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="contoh : 'Pemrograman Lanjutan'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              {/* Tombol untuk menyimpan perubahan judul course */}
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
