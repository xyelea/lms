import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function CoursesPage() {
  return (
    <div className="">
      <Link href="/teacher/create">
        <Button>New Course</Button>
      </Link>
    </div>
  );
}
