// /app/course/[courseId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from '@/app/_utils/axiosInstance';
import toast from 'react-hot-toast';
import ModuleCard from '@/app/components/Course/ModuleCard';
import BackButton from '@/app/components/common/BackButton';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import { Module, ModuleCategory, BackendCourse } from '@/app/types';

const CoursePage = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [moduleCategories, setModuleCategories] = useState<ModuleCategory[]>([]);
  const [courseName, setCourseName] = useState<string>('Loading...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError('Course ID is undefined.');
      setLoading(false);
      toast.error('Course ID is undefined.');
      return;
    }

    const fetchCourseModules = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseResp = await axiosInstance.get(`/courses/${courseId}`, {
          withCredentials: true,
        });
        const course: BackendCourse = courseResp.data;
        setCourseName(course.title || 'Unnamed Course');

        // Fetch modules
        const modulesResp = await axiosInstance.get(`/courses/${courseId}/modules`, {
          withCredentials: true,
        });
        const modulesData: Module[] = await Promise.all(
          modulesResp.data.map(async (module: any) => {
            // Fetch PM score for each module
            try {
              const pmResp = await axiosInstance.get(`/progress/module/${module._id}`, {
                withCredentials: true,
              });
              return {
                _id: module._id,
                title: module.title,
                difficulty: module.difficulty,
                pmScore: pmResp.data.progress || 0,
              };
            } catch (pmError) {
              console.error(`Failed to fetch PM for module ${module._id}:`, pmError);
              return {
                _id: module._id,
                title: module.title,
                difficulty: module.difficulty,
                pmScore: 0,
              };
            }
          })
        );

        // Group modules by difficulty
        const groupedModules: { [key: string]: Module[] } = modulesData.reduce(
          (acc, module) => {
            if (!acc[module.difficulty]) acc[module.difficulty] = [];
            acc[module.difficulty].push(module);
            return acc;
          },
          {} as { [key: string]: Module[] }
        );

        // Calculate average PM for each category
        const categories: ModuleCategory[] = Object.keys(groupedModules).map((difficulty) => {
          const modules = groupedModules[difficulty];
          const averagePM =
            modules.reduce((sum, module) => sum + module.pmScore, 0) / modules.length || 0;
          return {
            difficulty,
            averagePM: parseFloat(averagePM.toFixed(2)),
            modules,
          };
        });

        setModuleCategories(categories);
      } catch (err) {
        console.error('Failed to fetch course modules:', err);
        setError('Failed to load course modules.');
        toast.error('Failed to load course modules.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseModules();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
        <BackButton />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6">{courseName}</h1>

      {moduleCategories.map((category) => (
        <section key={category.difficulty} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{category.difficulty} Modules</h2>
            <span className="text-blue-600 underline">
              Average PM: {category.averagePM}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.modules.map((module) => (
              <ModuleCard key={module._id} module={module} />
            ))}
          </div>
        </section>
      ))}

      {/* Forum Button */}
      <div className="mt-10">
        <button
          onClick={() => router.push(`/forum/${courseId}`)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go to Forum
        </button>
      </div>
    </div>
  );
};

export default CoursePage;
