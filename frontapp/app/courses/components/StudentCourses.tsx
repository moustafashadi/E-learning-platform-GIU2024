import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // Assuming you have react-hot-toast set up
import { format } from "date-fns"; // If you want to format the dates


interface Course {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  resources: string[]; // List of resources
  instructor: string; // Instructor's ID
  quizzes: string[];  // List of quizzes
  notes: string[];    // List of notes (or any format you use)
}

interface Note {
  _id: string;
  courseId: { $oid: string }; // Object with $oid
  content: string;
  userId: { $oid: string }; // Object with $oid
  isPinned: boolean;
  created_at: string;
  last_updated: string;
}


function StudentCourses() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [instructorName, setInstructorName] = useState<string>("Loading...");
  const [notes, setNotes] = useState<Note[]>([]); // Notes are now typed as an array of Note objects
  const [loadingNotes, setLoadingNotes] = useState(true); // Loading state for notes






 // Fetch notes for the logged-in user
 const fetchNotes = async (userId: string) => {
  try {
    setLoadingNotes(true);
    const response = await axios.get(`http://localhost:3000/notes`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${userId}`,
      },
    });
   
    setNotes(response.data.notes); // Assuming the response contains an array of notes
  } catch (error) {
    toast.error("Failed to fetch notes.");
    console.error(error);
  } finally {
    setLoadingNotes(false);
  }
};





  const fetchCourses = async () => {
    try {
      const { data: authData } = await axios.get("/auth/me", { withCredentials: true });
      const enrolledResponse = await axios.get(
        `http://localhost:3000/users/${authData.id}/enrolledCourses`,
        { withCredentials: true }
      );
      setEnrolledCourses(enrolledResponse.data);

      const allCoursesResponse = await axios.get("http://localhost:3000/courses", {
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

  // Fetch instructor name when the selected course changes
  useEffect(() => {
    const fetchInstructorName = async (instructorId: string) => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${instructorId}`, {
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
  }, [selectedCourse]); // This hook runs whenever `selectedCourse` changes

  useEffect(() => {
    fetchCourses(); // Fetch courses when the component mounts
  }, []);


  // Fetch notes when the selected course changes
  useEffect(() => {
    if (selectedCourse) {
      const fetchUserNotes = async () => {
        try {
          const { data: authData } = await axios.get("/auth/me", { withCredentials: true });
          const userId = authData.id;
          fetchNotes(userId); // Fetch notes for the logged-in user
        } catch (error) {
          console.error("Failed to fetch user data for notes", error);
        }
      };
      fetchUserNotes();
    }
  }, [selectedCourse]); // Only run when the selected course changes



  const enrollInCourse = async (courseId: string) => {
    try {
      const { data: authData } = await axios.get("/auth/me", { withCredentials: true });
      await axios.post(
        `http://localhost:3000/users/${authData.id}/enroll/${courseId}`,
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
  <div className="space-y-2">
    {Array.isArray(selectedCourse.resources) && selectedCourse.resources.length > 0 ? (
      selectedCourse.resources.map((resource, index) => {
        // Normalize the path to ensure it's in the correct format
        let normalizedResource = resource.replace(/\\/g, "/");  // Convert all backslashes to forward slashes

        // Check if the resource starts with '/uploads/', and remove '/uploads/' part if it does
        if (normalizedResource.startsWith("/uploads/")) {
          normalizedResource = normalizedResource.replace("/uploads/", "");  // Remove '/uploads/' from the path
        }

        // Construct the view URL
        let viewUrl = normalizedResource;

        // If the resource is not a full URL or path, create the correct URL
        if (!viewUrl.startsWith("http") && !viewUrl.startsWith("/")) {
          viewUrl = `http://localhost:3000/courses/${selectedCourse.course_code}/resource/${encodeURIComponent(viewUrl)}`;
        } else {
          // If it's already a full URL, no need to modify it
          if (!viewUrl.startsWith("http")) {
            viewUrl = `http://localhost:3000/courses/${selectedCourse.course_code}/resource${encodeURIComponent(viewUrl)}`;
          }
        }

        // Extract the filename from the last part of the path (no encoding here)
        const filename = normalizedResource.split("/").pop() || "default-filename";

        // Display the filename without encoding
        return (
          <a
            key={index}
            href={viewUrl}  // Use the constructed URL
            target="_blank"  // Open in a new tab
            rel="noopener noreferrer"  // Security for new tab
            className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View {filename}  {/* Display the filename without URL encoding */}
          </a>
        );
      })
    ) : (
      <div>No resources available</div>
    )}
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

               {/* Notes Section */}

               <div>
  <strong>Notes:</strong>
  <div className="space-y-2">
    {loadingNotes ? (
      <div>Loading notes...</div> // Loading state
    ) : notes.length > 0 ? (
      notes.map((note, index) => (
        <div key={index} className="p-4 bg-gray-100 rounded shadow-md">
          <p><strong>Content:</strong> {note.content}</p> {/* Display note content */}
<p><strong>Course ID:</strong> {note.courseId?.toString()}</p> {/* Access the courseId as a string */}
<p><strong>User ID:</strong> {note.userId?.toString()}</p> {/* Access the userId as a string */}
<p><strong>Is Pinned:</strong> {note.isPinned ? "Yes" : "No"}</p> {/* Display if pinned */}
<p><strong>Created At:</strong> {note.created_at ? new Date(note.created_at).toLocaleString() : "Invalid date"}</p> {/* Format created_at */}
<p><strong>Last Updated:</strong> {note.last_updated ? new Date(note.last_updated).toLocaleString() : "Invalid date"}</p> {/* Format last_updated */}


     </div>
      ))
    ) : (
      <div>No notes available</div>
    )}
  </div>
</div>

            </>
          )}
        </section>
      )}
    </div>
  );
}

export default StudentCourses;
