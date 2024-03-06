"use client";
// Mengimpor modul-modul yang diperlukan dari pustaka dan package yang sesuai

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

// Definisi properti untuk komponen DescriptionForm
interface DescriptionFormProps {
  initialData: Course; // Data awal kursus
  courseId: string; // ID kursus
}

// Skema validasi untuk formulir deskripsi kursus menggunakan Zod
const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required", // Pesan kesalahan jika deskripsi tidak diisi
  }),
});
// Komponen DescriptionForm untuk mengedit deskripsi kursus
export const DescriptionForm = ({
  initialData,
  courseId,
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false); // State untuk mengontrol mode pengeditan
  // Fungsi untuk mengganti mode pengeditan
  const toggleEdit = () => setIsEditing((current) => !current);
  // Hook useRouter untuk mendapatkan objek router
  const router = useRouter();

  // Hook useForm dari react-hook-form untuk mengelola formulir
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Resolver untuk validasi menggunakan Zod
    defaultValues: {
      description: initialData?.description || "", // Nilai awal untuk deskripsi
    },
  });

  // Menyimpan status isSubmitting dan isValid dari formulir
  const { isSubmitting, isValid } = form.formState;
  // Menangani pengiriman formulir
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Mengirim permintaan PATCH untuk memperbarui deskripsi kursus
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
  // Mengembalikan tampilan Form untuk mengedit deskripsi kursus
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course description
        {/* Tombol untuk mengaktifkan atau menonaktifkan mode pengeditan */}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {/* Tampilan deskripsi kursus */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}>
          {initialData.description || "No description"}
        </p>
      )}
      {/* Formulir untuk mengedit deskripsi kursus */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
            {/* Input untuk mengedit deskripsi kursus */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'This course is about...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Tombol untuk menyimpan perubahan */}
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
