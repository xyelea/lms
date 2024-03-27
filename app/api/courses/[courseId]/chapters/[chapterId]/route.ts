import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    // Mendapatkan user ID dari Clerk untuk otorisasi
    const { userId } = auth();
    // Mendapatkan data yang dikirimkan dalam request PATCH
    const { isPublished, ...values } = await req.json();

    // Jika user belum terautentikasi, kembalikan respons Unauthorized
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Memeriksa apakah pengguna memiliki hak untuk memperbarui kursus
    const ownCourse = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    // Jika pengguna tidak memiliki hak, kembalikan respons Unauthorized
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Memperbarui data chapter dalam database berdasarkan ID chapter dan ID kursus
    const chapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { ...values },
    });

    // TODO: Handle Video Upload

    // Mengembalikan respons JSON dengan data chapter yang diperbarui
    return NextResponse.json(chapter);
  } catch (error) {
    // Tangani error dan kembalikan respons dengan status 500 (Internal Server Error)
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Terjadi kesalahan", { status: 500 });
  }
}
