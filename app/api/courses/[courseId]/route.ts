import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Fungsi PATCH untuk meng-handle permintaan PATCH HTTP
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Mendapatkan userId dari pengguna yang terotentikasi
    const { userId } = auth();
    // Mendapatkan courseId dari parameter yang diterima
    const { courseId } = params;
    // Mendapatkan nilai yang dikirim dalam permintaan PATCH
    const values = await req.json();

    // Memeriksa apakah pengguna terotentikasi
    if (!userId) {
      // Mengembalikan tanggapan NextResponse "Unauthorized" dengan status 401 jika pengguna tidak terotentikasi
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Memperbarui data kursus yang sesuai dengan courseId dan userId yang diberikan dengan nilai yang dikirim dalam permintaan
    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    // Mengembalikan data kursus yang diperbarui dalam format JSON sebagai tanggapan
    return NextResponse.json(course);
  } catch (error) {
    // Menangani kesalahan yang mungkin terjadi dengan mencetak pesan kesalahan ke konsol
    console.log("[COURSE_ID]", error);
    // Mengembalikan tanggapan NextResponse "Internal Error" dengan status 500 jika terjadi kesalahan dalam penanganan permintaan
    return new NextResponse("Internal Error", { status: 500 });
  }
}
