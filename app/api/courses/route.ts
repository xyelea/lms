import { auth } from "@clerk/nextjs"; // Import untuk autentikasi Clerk
import { NextResponse } from "next/server"; // Import untuk merespons permintaan berikutnya
import { db } from "@/lib/db"; // Import koneksi database

export async function POST(req: Request) {
  try {
    const { userId } = auth(); // Mendapatkan ID pengguna dari autentikasi Clerk
    const { title } = await req.json(); // Mendapatkan judul dari body permintaan

    // Jika tidak ada ID pengguna, kembalikan respons Unauthorized
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Buat course baru dalam database menggunakan koneksi db
    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    // Kembalikan respons dengan data course yang baru dibuat
    return NextResponse.json(course);
  } catch (error) {
    // Tangani kesalahan dengan mencetak log dan mengembalikan respons Internal Error
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
