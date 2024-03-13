import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
/**
 * Meng-handle permintaan DELETE untuk menghapus sebuah lampiran dari sebuah course.
 * @param req Objek Request dari client.
 * @param params Parameter yang mengandung courseId dan attachmentId.
 * @returns Respon JSON yang berisi detail lampiran yang dihapus, atau pesan error jika terjadi masalah.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = auth();

    // Memeriksa apakah pengguna terotentikasi
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: { id: params.courseId, userId: userId },
    });

    // Memeriksa apakah pengguna adalah pemilik course yang dimaksud
    if (!courseOwner) return new NextResponse("Unauthorized", { status: 401 });

    // Menghapus attachment dari database
    const attachment = await db.attachment.delete({
      where: { courseId: params.courseId, id: params.attachmentId },
    });

    return NextResponse.json(attachment); // Mengembalikan respon JSON dengan detail attachment yang dihapus
  } catch (error) {
    console.log("[Attachment_ID]", error);
    return new NextResponse("Internal Error", { status: 500 }); // Mengembalikan pesan error jika terjadi masalah
  }
}
