import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import TitleForm from "./_components/TitleForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";
import { CategoryForm } from "./_components/CategoryForm";
import { PriceForm } from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChaptersForm from "./_components/ChaptersForm";

export default async function CourseIdPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { userId } = auth(); // Mendapatkan ID pengguna dari autentikasi Clerk

  // Jika tidak ada ID pengguna, redirect ke halaman utama
  if (!userId) {
    return redirect("/");
  }

  // Ambil data course dari database berdasarkan courseId
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Jika tidak ada data course, redirect ke halaman utama
  if (!course) {
    return redirect("/");
  }

  // Tentukan field yang diperlukan untuk menyelesaikan course
  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];
  // Hitung total field yang diperlukan
  const totalFields = requiredFields.length;

  const completedFields = requiredFields.filter(Boolean).length; // Hitung field yang sudah terisi
  const completionText = `(${completedFields}/${totalFields})`; // Buat teks untuk menampilkan progres pengisian field
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Kustomisasi course anda</h2>
          </div>
          {/* form */}
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Course chapter</h2>
            </div>
            <ChaptersForm initialData={course} courseId={course.id} />
          </div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={CircleDollarSign} />
            <h2>Jual course anda</h2>
          </div>
          <PriceForm initialData={course} courseId={course.id} />
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl">Resources dan Attachments</h2>
            </div>
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
