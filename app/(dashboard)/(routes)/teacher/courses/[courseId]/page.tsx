import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

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
            <h2 className="text-xl">Customize your course</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
