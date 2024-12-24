// /components/Course/CourseCard.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import TakeQuizButton from '../Common/TakeQuizButton';

interface CourseCardProps {
  course: {
    id: string;
    slug: string;
    name: string;
    progress: number;
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  const router = useRouter();

  const handleViewCourse = () => {
    router.push(`/course/${course.slug}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col">
      <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
      <div className="h-2 bg-gray-200 rounded-full mb-2">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${course.progress}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-700 mb-4">Progress: {course.progress}%</span>
      <div className="mt-auto flex space-x-4">
        <button
          onClick={handleViewCourse}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View Course
        </button>
        <TakeQuizButton moduleSlug={course.slug} />
      </div>
    </div>
  );
};

export default CourseCard;
