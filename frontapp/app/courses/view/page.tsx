"use client";

import { useSearchParams } from "next/navigation";
import ViewCourseStudent from "./ViewCourseStudent";
import Notes from "./notes";

function ViewPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseid");

  if (!courseId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">No Course Selected</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Course Details</h1>
      <ViewCourseStudent courseid={courseId} />
      <h2 className="text-xl font-bold mt-8 mb-4">Notes</h2>
      <Notes courseId={courseId} />
    </div>
  );
}

export default ViewPage;
