import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

/**
 * Meng-handle permintaan POST untuk menambahkan lampiran baru ke dalam sebuah course.
 * @param req Objek Request dari client.
 * @param params Parameter yang mengandung courseId.
 * @returns Respon JSON yang berisi detail lampiran yang baru ditambahkan, atau pesan error jika terjadi masalah.
 */
export async function POST(
  req: Request, // Permintaan HTTP
  { params }: { params: { courseId: string } } // Parameter kursus dari permintaan
) {
  try {
    const { userId } = auth(); // Mendapatkan userId dari autentikasi
    const { url } = await req.json(); // Mendapatkan URL lampiran dari data JSON yang dikirimkan

    // Periksa apakah pengguna sudah login
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 }); // Respon 401 Unauthorized jika tidak
    }

    // Temukan pemilik kursus berdasarkan ID kursus dan ID pengguna
    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId: userId }, // Kondisi pencarian
    });

    // Jika pengguna bukan pemilik kursus, kembalikan respons Unauthorized
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Buat lampiran baru dalam database
    const attachment = await db.attachment.create({
      data: {
        url, // URL lampiran
        name: url.split("/").pop(), // Nama lampiran, diambil dari bagian terakhir URL
        courseId: params.courseId, // ID kursus
      },
    });

    return NextResponse.json(attachment); // Respon dengan data lampiran yang baru dibuat
  } catch (error) {
    console.log("[COURSE_ID_ATTACHMENTS]", error); // Tangani kesalahan dengan mencetaknya ke konsol
    return new NextResponse("Internal error", { status: 500 }); // Kembalikan respons kesalahan internal
  }
}
