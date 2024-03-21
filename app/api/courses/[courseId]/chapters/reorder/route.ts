import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
/**
 * Handle PUT request to reorder chapters in a course.
 * @param req The request object.
 * @param params The parameters containing the course ID.
 * @returns A response indicating success or failure.
 */
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Get the user ID from the authentication token
    const { userId } = auth();

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Extract the list of reordered chapters from the request body
    const { list } = await req.json();

    // Check if the user owns the course
    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    // If user does not own the course, return unauthorized status
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Update the position of each chapter in the database
    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    // Return success response
    return new NextResponse("Sukses", { status: 200 });
  } catch (error) {
    // Menangani kesalahan yang terjadi selama proses
    console.log("[Reorder]", error);
    // Mengembalikan respons kesalahan internal server
    return new NextResponse("Terjadi kesalahan", { status: 500 });
  }
}
