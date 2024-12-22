import { useState, useEffect } from "react";
import axiosInstance from "@/app/_utils/axiosInstance";
import toast from "react-hot-toast"; // Assuming you have react-hot-toast set up
import axios from "axios";

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
  last_updated: string;
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
  const [creatingNote, setCreatingNote] = useState(false); // Flag to handle note creation loading state
  const [content, setContent] = useState(""); 
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");




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

const editNote = (noteId: string, currentContent: string) => {
  // Set the note ID and current content for editing
  setEditingNoteId(noteId);
  setEditedContent(currentContent);  // Pre-fill the text field with the current note content
};

const handleSaveClick = async (noteId: string) => {
  if (editedContent.trim() === "") {
    toast.error("Note content cannot be empty.");
    return;
  }
  try {
    // Get the current date in ISO format
    const lastUpdated = new Date().toISOString();  // Make sure this is a valid ISO date string
    const response = await axiosInstance.put(
      `/notes/${noteId}`,
      { content: editedContent, last_updated: lastUpdated },
      { withCredentials: true }
    );
    // Assuming response contains the updated note with the new "last_updated" field
    const updatedNote = response.data;

    // Ensure that the date is in a valid format when updating the note state
    const validLastUpdatedDate = updatedNote.last_updated
      ? new Date(updatedNote.last_updated).toLocaleString() // Format it for display
      : new Date().toLocaleString(); // Fallback to current date if not valid

    // Update the note in the UI with the new content and last_updated timestamp
    setCourseNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === noteId
          ? { ...note, content: editedContent, last_updated: validLastUpdatedDate }
          : note
      )
    );
    setEditingNoteId(null); // Reset editing state
    toast.success("Note updated successfully.");
  } catch (error) {
    toast.error("Failed to update note.");
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
          {editingNoteId === note._id ? (
            <div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded-md"
              />
              <button
                onClick={() => handleSaveClick(note._id)}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="font-semibold text-lg">{note.content}</div>
          )}

          {/* Note Metadata */}
          <div className="text-sm text-gray-500 mt-2">
            <div><strong>Created:</strong> {new Date(note.created_at).toLocaleString()}</div>
            <div><strong>Last Updated:</strong> {new Date(note.last_updated).toLocaleString()}</div>
            <div><strong>Pinned:</strong> {note.isPinned ? "Yes" : "No"}</div>
          </div>

          {/* Action Buttons */}
          <div className="mt-2 flex space-x-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => editNote(note._id, note.content)} // Start editing the note
            >
              Edit
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={() => deleteNote(note._id)} // Delete button remains the same
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

  {/* Create Note Button */}
  <div className="mt-4 flex items-center space-x-4">
  {/* Input field for note content */}
  <textarea
    className="w-full p-2 border rounded-md"
    placeholder="Enter note content"
    value={newNoteContent}
    onChange={(e) => setNewNoteContent(e.target.value)} // Bind to state
    rows={3} // Adjust the number of rows based on how large you want the input area
  />
  
  {/* Create Note Button */}
  <button
    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    onClick={() => {
      if (selectedCourse) {
        addNote(); // Call the function to add the note
      } else {
        console.error('Selected course is null');
      }
    }}
    disabled={creatingNote || !newNoteContent.trim()} // Disable if creating or content is empty
  >
    {creatingNote ? 'Creating note...' : 'Create Note'}
  </button>
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