// /app/components/Course/CourseCard.tsx

import React from 'react';
import { FrontendCourse } from '@/app/types';

interface CourseCardProps {
  course: FrontendCourse;
  isEnrolled: boolean;
  onViewCourse: () => void;
  onEnroll?: () => void; // Optional, only for available courses
  isEnrolling?: boolean;  // Optional, indicates if enrollment is in progress
}

const CourseCard = ({
  course,
  isEnrolled,
  onViewCourse,
  onEnroll,
  isEnrolling = false,
}: CourseCardProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col">
      <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
      {isEnrolled && (
        <>
          <div className="h-2 bg-gray-200 rounded-full mb-2">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-700 mb-4">Progress: {course.progress}%</span>
        </>
      )}
      <div className="mt-auto flex space-x-4">
        <button
          onClick={onViewCourse}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View Course
        </button>
        {!isEnrolled && onEnroll && (
          <button
            onClick={onEnroll}
            className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
              isEnrolling ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isEnrolling}
          >
            {isEnrolling ? 'Enrolling...' : 'Enroll'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
