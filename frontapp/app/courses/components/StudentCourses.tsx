import { useState, useEffect } from "react";
import axiosInstance from "@/app/_utils/axiosInstance";
import toast from "react-hot-toast"; // Assuming you have react-hot-toast set up

interface Course {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  resources: string[];
  instructor: string;
  quizzes: string[];
  notes: string[];
}


interface Note {
  _id: string;
  courseId: string;
  content: string;
  userId: string;
  isPinned: boolean;
  created_at: string;
}


function StudentCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [instructorName, setInstructorName] = useState<string>("Loading...");
  const [courseNotes, setCourseNotes] = useState<Note[]>([]); // Correct type
  const [loadingNotes, setLoadingNotes] = useState<boolean>(false); // Track loading state
  const [newNoteContent, setNewNoteContent] = useState<string>(""); // For adding notes
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null); // Track editing note


  const fetchCourses = async () => {
    try {
      const { data: authData } = await axiosInstance.get("/auth/me", { withCredentials: true });
      const enrolledResponse = await axiosInstance.get(
        `/users/${authData.id}/enrolledCourses`,
        { withCredentials: true }
      );
      setEnrolledCourses(enrolledResponse.data);

      const allCoursesResponse = await axiosInstance.get(`/courses`, {
        withCredentials: true,
      });
      const enrolledCourseIds = new Set(
        enrolledResponse.data.map((course: Course) => course._id)
      );
      const availableCourses = allCoursesResponse.data.filter(
        (course: Course) => !enrolledCourseIds.has(course._id)
      );
      setAvailableCourses(availableCourses);
    } catch (error) {
      toast.error("Failed to fetch courses. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      // Fetch notes when a course is selected
      const fetchCourseNotes = async () => {
        setLoadingNotes(true);
        try {
          const response = await axiosInstance.get(`/notes/${selectedCourse._id}`, {
            withCredentials: true,
          });
          setCourseNotes(response.data.notes); // Ensure the response is in the correct format
        } catch (error) {
          console.error("Error fetching notes:", error);
        } finally {
          setLoadingNotes(false);
        }
      };

      fetchCourseNotes();
    }
  }, [selectedCourse]); // Trigger when selectedCourse changes


  // Fetch instructor name when the selected course changes
  useEffect(() => {
    const fetchInstructorName = async (instructorId: string) => {
      try {
        const response = await axiosInstance.get(`/users/${instructorId}`, {
          withCredentials: true,
        });
        setInstructorName(response.data.username); // Set the instructor name from the API response
      } catch (error) {
        console.error("Failed to fetch instructor details:", error);
        setInstructorName("Unknown Instructor");
      }
    };

    if (selectedCourse?.instructor) {
      fetchInstructorName(selectedCourse.instructor); // Fetch the instructor's name
    } else {
      setInstructorName("Loading...");
    }
  }, [selectedCourse]); // This hook runs whenever selectedCourse changes

  useEffect(() => {
    fetchCourses(); // Fetch courses when the component mounts
  }, []);

  const enrollInCourse = async (courseId: string) => {
    try {
      const { data: authData } = await axiosInstance.get("/auth/me", { withCredentials: true });
      await axiosInstance.post(
        `/users/${authData.id}/enroll/${courseId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Successfully enrolled in the course!");

      const enrolledCourse = availableCourses.find((course) => course._id === courseId);
      if (enrolledCourse) {
        setEnrolledCourses((prev) => [...prev, enrolledCourse]);
        setAvailableCourses((prev) => prev.filter((course) => course._id !== courseId));
      }
    } catch (error) {
      toast.error("Failed to enroll in the course.");
    }
  };

  const viewCourseDetails = (courseId: string) => {
    const course = enrolledCourses.concat(availableCourses).find((course) => course._id === courseId);
    setSelectedCourse(course || null); // Set the selected course
  };

  const hideCourseDetails = () => {
    setSelectedCourse(null); // Hide the course details
  };
  useEffect(() => {
    if (selectedCourse) {
      const fetchCourseNotes = async () => {
        setLoadingNotes(true);
        try {
          const response = await axiosInstance.get(
            `/notes/${selectedCourse._id}`,
            { withCredentials: true }
          );
          setCourseNotes(response.data.notes);
        } catch (error) {
          console.error("Error fetching notes:", error);
        } finally {
          setLoadingNotes(false);
        }
      };

      fetchCourseNotes();
    }
  }, [selectedCourse]);

  const deleteNote = async (noteId: string) => {
    try {
      await axiosInstance.delete(`/notes/${noteId}`, {
        withCredentials: true,
      });
      setCourseNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      toast.success("Note deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete note.");
      console.error(error);
    }
  };
const addNote = async () => {
  if (!newNoteContent.trim()) {
    toast.error("Note content cannot be empty.");
    return;
  }

  try {
    const response = await axiosInstance.post(
      `/notes/${selectedCourse?._id}`,
      { content: newNoteContent },
      { withCredentials: true }
    );
    setCourseNotes((prevNotes) => [...prevNotes, response.data]);
    setNewNoteContent("");
    toast.success("Note added successfully.");
  } catch (error) {
    toast.error("Failed to add note.");
    console.error(error);
  }
};
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg font-semibold">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="mt-[2rem] p-6 space-y-6 bg-gray-100">
      {!selectedCourse && (
        <>
          {/* Enrolled Courses Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Enrolled Courses</h2>
            {enrolledCourses.length > 0 ? (
              <ul className="space-y-4">
                {enrolledCourses.map((course) => (
                  <li key={course._id} className="p-4 bg-white rounded shadow-md border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold">{course.title}</h3>
                        <p className="text-gray-700">{course.description}</p>
                      </div>
                      <button
                        onClick={() => viewCourseDetails(course._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        View Course
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You are not enrolled in any courses yet.</p>
            )}
          </section>

          {/* Available Courses Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
            {availableCourses.length > 0 ? (
              <ul className="space-y-4">
                {availableCourses.map((course) => (
                  <li
                    key={course._id}
                    className="p-4 bg-white rounded shadow-md border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">{course.title}</h3>
                      <p className="text-gray-700">{course.description}</p>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => enrollInCourse(course._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Enroll
                      </button>
                      <button
                        onClick={() => viewCourseDetails(course._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        View Course
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No courses available for enrollment.</p>
            )}
          </section>
        </>
      )}

      {selectedCourse && (
        <section className="mt-6 bg-white p-6 rounded shadow-md">
          <button
            onClick={hideCourseDetails}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to Courses
          </button>
          <h1 className="text-2xl font-bold">{selectedCourse.title}</h1>
          <div>
            <strong>Description:</strong> {selectedCourse.description}
          </div>
          <div>
            <strong>Category:</strong> {selectedCourse.category}
          </div>
          <div>
            <strong>Difficulty:</strong> {selectedCourse.difficulty}
          </div>
          {enrolledCourses.some((course) => course._id === selectedCourse._id) && (
            <>
              <div>
                <strong>Instructor:</strong> {instructorName}
              </div>
              <div>
                <strong>Resources:</strong>
                <div>
                  <strong>Resources:</strong>
                  <div className="space-y-2">
                    {Array.isArray(selectedCourse.resources) && selectedCourse.resources.length > 0 ? (
                      selectedCourse.resources.map((resource, index) => {
                        // Normalize the path
                        const normalizedResource = resource.replace(/\\/g, "/").replace("/uploads/", "");

                        // Construct the correct view URL
                        const viewUrl = `/courses/${selectedCourse.course_code}/resource/${encodeURIComponent(normalizedResource)}`;

                        // Extract the filename
                        const filename = normalizedResource.split("/").pop() || "default-filename";

                        return (
                          <a
                            key={index}
                            href={viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            View {filename}
                          </a>
                        );
                      })
                    ) : (
                      <div>No resources available</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <strong>Quizzes:</strong>
                <ul className="list-disc pl-5">
                  {Array.isArray(selectedCourse.quizzes) && selectedCourse.quizzes.length > 0 ? (
                    selectedCourse.quizzes.map((quiz, index) => (
                      <li key={index}>{quiz}</li>
                    ))
                  ) : (
                    <li>No quizzes available</li>
                  )}
                </ul>
              </div>

              <div>
            <strong>Notes:</strong>
            <ul className="list-disc pl-5">
              {loadingNotes ? (
                <li>Loading notes...</li>
              ) : courseNotes.length > 0 ? (
                courseNotes.map((note) => (
                  <li key={note._id} className="bg-gray-50 p-4 rounded-md shadow-md mb-3">
                    {/* Note Content */}
                    <div className="font-semibold text-lg">{note.content}</div>

                    {/* Note Metadata */}
                    <div className="text-sm text-gray-500 mt-2">
                      <div><strong>Created:</strong> {new Date(note.created_at).toLocaleString()}</div>
                      <div><strong>Pinned:</strong> {note.isPinned ? "Yes" : "No"}</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-2 flex space-x-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={() => deleteNote(note._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li>No notes available</li>
              )}
            </ul>
          </div>


            </>
          )}
        </section>
      )}
    </div>
  );
}

export default StudentCourses;