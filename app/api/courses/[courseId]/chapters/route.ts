import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

/**
 * Handler for creating a new chapter for a course.
 * @param req The request object.
 * @param params Parameters containing the courseId.
 * @returns A response indicating the success or failure of the operation.
 */
export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    // Retrieve the user ID from the authentication token
    const { userId } = auth();
    // Extract the chapter title from the request body
    const { title } = await req.json();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify if the user owns the course
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    // If the user does not own the course, return unauthorized
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the last chapter for the course to determine the position of the new chapter
    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    // Determine the position of the new chapter
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // Create a new chapter in the database
    const chapter = await db.chapter.create({
      data: { title, courseId: params.courseId, position: newPosition },
    });

    // Return the newly created chapter
    return NextResponse.json(chapter);
  } catch (error) {
    // Log any errors that occur during the process
    console.log("[CHAPTERS]", error);
    // Return an internal server error response
    return new NextResponse("Internal Error", { status: 500 });
  }
}
