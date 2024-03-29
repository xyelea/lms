"use client";

import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
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

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

/**
 * Component for editing chapter description.
 * @param initialData Initial data of the chapter.
 * @param courseId ID of the course.
 * @param chapterId ID of the chapter.
 */
export default function ChapterDescriptionForm({
  initialData,
  courseId,
  chapterId,
}: ChapterDescriptionFormProps) {
  // State to toggle between editing mode and view mode
  const [isEditing, setIsEditing] = useState(false);

  // Function to toggle editing mode
  const toggleEdit = () => setIsEditing((current) => !current);

  // Next.js router hook
  const router = useRouter();

  // React Hook Form hook for form handling
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Send PATCH request to update chapter description
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      // Display success message
      toast.success("Chapter di perbarui");
      // Exit editing mode
      toggleEdit();
      // Refresh page
      router.refresh();
    } catch (error) {
      // Display error message if request fails
      toast.error("Terjadi kesalahan");
    }
  };
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Deskripsi chapter
        {/* Button to toggle editing mode */}
        <Button variant={"ghost"} onClick={toggleEdit}>
          {isEditing ? (
            <>Batal</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit deskripsi
            </>
          )}
        </Button>
      </div>
      {/* Display chapter description in view mode */}
      {!isEditing && (
        <div
          className={cn(
            `text-sm mt-2`,
            !initialData.description && "text-slate-500 italic"
          )}>
          {!initialData.description && "Tidak ada deskripsi"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      )}
      {/* Display form for editing chapter description in editing mode */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/* Editor component for editing description */}
                    <Editor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              {/* Button to submit form */}
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
