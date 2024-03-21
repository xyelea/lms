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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, Course } from "@prisma/client";
import axios from "axios";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import ChapterList from "./ChapterList";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: String;
}

const formSchema = z.object({
  title: z.string().min(1),
});

export default function ChaptersForm({
  initialData,
  courseId,
}: ChaptersFormProps) {
  // state
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter dibuat");
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };
  // Fungsi yang dipanggil saat mengubah urutan chapter
  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true); // Mengatur status bahwa sedang dalam proses pembaruan

      // Melakukan permintaan PUT ke backend Next.js untuk memperbarui urutan chapter
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData, // Mengirim data urutan yang baru ke backend
      });
      toast.success("Urutan chapter telah diatur"); // Memberikan pemberitahuan berhasil
      router.refresh(); // Me-refresh halaman untuk menampilkan perubahan yang baru
    } catch (error) {
      toast.error("Terjadi kesalahan"); // Menampilkan pesan kesalahan jika terjadi error
    } finally {
      setIsUpdating(false); // Mengatur status bahwa proses pembaruan sudah selesai
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Chapter course
        <Button onClick={toggleCreating} variant={"ghost"}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Tambah Chapter
            </>
          )}
        </Button>
      </div>
      {!isCreating && (
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
                      placeholder="contoh : pengenalan course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Buat
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            `text-sm mt-2`,
            !initialData.chapters.length && "text-slate-500 italic"
          )}>
          {!initialData.chapters.length && "Belum ada chapter"}
          {/* Todo : Add a list of chapter */}
          <ChapterList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          &quot;Drag&quot; dan &quot;Drop&quot; untuk mengatur urutan chapter
        </p>
      )}
    </div>
  );
}
