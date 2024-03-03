"use client";
// Import komponen UI yang diperlukan dari direktori tertentu

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// Import resolver Zod dari pustaka react-hook-form
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios"; // Import modul axios untuk melakukan HTTP request
import Link from "next/link"; // Import modul Link dari Next.js untuk navigasi
import { useRouter } from "next/navigation"; // Import useRouter dari Next.js untuk pengelolaan rute
import React from "react"; // Import modul React
import { useForm } from "react-hook-form"; // Import useForm dari react-hook-form untuk manajemen form
import toast from "react-hot-toast"; // Import modul toast untuk menampilkan notifikasi
import { z } from "zod"; // Import modul zod untuk validasi skema data

// Definisi skema form menggunakan Zod
const formSchema = z.object({
  title: z.string().min(1, { message: "Title harus di isi!" }),
});

// Komponen utama untuk halaman pembuatan course
export default function CreateCoursePage() {
  const router = useRouter(); // Inisialisasi router Next.js
  // Inisialisasi useForm dari react-hook-form dengan menggunakan resolver Zod dan nilai default
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Menggunakan resolver Zod untuk validasi form
    defaultValues: {
      title: "", // Nilai default untuk field "title"
    },
  });

  const { isSubmitting, isValid } = form.formState; // Mendapatkan status isSubmitting dan isValid dari useForm

  // Fungsi yang akan dipanggil saat form disubmit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Mengirim data form ke API menggunakan metode POST
      const response = await axios.post("/api/course", values);
      // Jika pengiriman berhasil, redirect pengguna ke halaman detail course yang baru dibuat
      router.push(`/teacher/courses/${response.data.id}`);
    } catch {
      // Jika terjadi kesalahan saat pengiriman data, tampilkan notifikasi error
      toast.error("Terjadi kesalahan");
    }
  };
  // Render tampilan halaman pembuatan course
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Beri nama course anda</h1>
        <p className="text-sm text-slate-600">
          Apa nama yang ingin anda gunakan untuk course anda ? Jangan khawatir,
          anda bisa merubahnya kapan saja.
        </p>
        {/* Komponen Form dari UI */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8">
            {/* Field FormField yang menggunakan control dari useForm */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul course</FormLabel>
                  <FormControl>
                    {/* Input field untuk judul course */}
                    <Input
                      disabled={isSubmitting}
                      placeholder="contoh : Javascript Pemula"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Apa topik yang akan anda ajarkan ?
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* Tombol untuk membatalkan pembuatan course */}
            <div className="flex items-center gap-x-2">
              <Link href={"/"}>
                <Button type="button" variant={"ghost"}>
                  Cancel
                </Button>
              </Link>
              {/* Tombol untuk melanjutkan pembuatan course */}
              <Button type="submit" disabled={!isValid}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
