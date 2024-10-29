import React, { useState, useEffect } from "react";
import "./dstyle.css"; // Import your CSS styles
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import Axios
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [showQuestionModal,setQuestionModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null); // Store selected course ID
  const [questionData, setQuestionData] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
  });
  const [materialData, setMaterialData] = useState({ title: '', description: '', y_link: '' }); // Form data
  const navigate = useNavigate();

  const instructorId = localStorage.getItem('id'); // Assuming you're storing the instructor's ID in localStorage

  useEffect(() => {
    const fetchCourses = async () => {
      if (instructorId) {
        try {
          const response = await axios.get(`http://localhost:7000/api/courses/instructor/${instructorId}`);
          setCourses(response.data); // Set the fetched courses data
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchCourses();
  }, [instructorId]);


  function handleMaterialChange(e) {
    const { name, value } = e.target;
    setMaterialData(prevData => ({ ...prevData, [name]: value }));
  }

  function handleQuestionChange(e) {
    const { name, value } = e.target;
    setQuestionData(prevData => ({ ...prevData, [name]: value }));
  }

  async function handleAddMaterial(e) {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:7000/api/materials/add-material`, {
        id: selectedCourseId,
        ...materialData
      });
      // Optionally refresh course materials or show success message
      setShowModal(false); // Close modal after submission
      setMaterialData({ title: '', description: '', y_link: '' }); // Reset form data
      toast.success('Material added successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    } catch (error) {
      console.error("Error adding material:", error);
    }
  }

  async function handleAddQuestion(e) {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:7000/api/questions`, {
        courseId: selectedCourseId,
        ...questionData
      });
      // Optionally refresh course materials or show success message
      setQuestionModal(false); // Close modal after submission
      setQuestionData({ question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: '',
       }); // Reset form data
      toast.success('Question added successfully', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    } catch (error) {
      console.error("Error adding question:", error);
    }
  }

  return (
    <>
      <div>
        <SideBar current={"courses"} />
        <section id="content">
          <Navbar />
          <main className="t">
            <div className="table-data" style={{ marginTop: "-10px" }}>
              <div className="order">
                <div className="head">
                  <h3>Courses</h3>
                </div>
                <div id="course" className="todo">
                  <ul className="todo-list">
                    {courses.map((course) => (
                      <div key={course._id}> {/* Use _id for unique key */}
                        <li className="completed" style={{ marginTop: "10px", backgroundColor: 'white', color: 'black' }}>
                          <p>{course.course_name} <br /> Instructor: {course.instructor ? course.instructor.username : 'Unknown'}</p>
                          <div style={{ width: "50px", display: "flex", justifyContent: "space-between", }}>
                            <button
                              onClick={() => {
                                setSelectedCourseId(course._id); // Set selected course ID
                                setShowModal(true); // Show modal
                              }}
                              style={{
                                backgroundColor: "#457BC1",
                                borderRadius: "10px",
                                color: "white",
                                border: "none",
                                padding: "8px",
                                fontWeight: "500",
                                marginRight:"10px"
                              }}
                            >
                              Materials
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCourseId(course._id);
                                setQuestionModal(true);
                              }} // Use _id for course ID
                              style={{
                                backgroundColor: "#457BC1",
                                borderRadius: "10px",
                                color: "white",
                                border: "none",
                                padding: "8px",
                                fontWeight: "500",
                              }}
                            >
                              Questions
                            </button>
                          </div>
                        </li>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal for Adding Material */}
            {showModal && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                  <h2>Add Material</h2>
                  <form onSubmit={handleAddMaterial}>
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={materialData.title}
                      onChange={handleMaterialChange}
                      required
                    />
                    <textarea
                      name="description"
                      placeholder="Description"
                      value={materialData.description}
                      onChange={handleMaterialChange}
                      required
                    />
                    <input
                      type="url"
                      name="y_link"
                      placeholder="YouTube Link"
                      value={materialData.y_link}
                      onChange={handleMaterialChange}
                      required
                    />
                    <button type="submit">Add Material</button>
                  </form>
                </div>
              </div>
            )}

{showQuestionModal && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => setQuestionModal(false)}>&times;</span>
                  <h2>Add Question</h2>
                  <form onSubmit={handleAddQuestion}>
                    <input
                      type="text"
                      name="question"
                      placeholder="Question"
                      value={questionData.question}
                      onChange={handleQuestionChange}
                      required
                    />
                    <input
                      type="text"
                      name="option1"
                      placeholder="Option 1"
                      value={questionData.option1}
                      onChange={handleQuestionChange}
                      required
                    />
                       <input
                      type="text"
                      name="option2"
                      placeholder="Option 2"
                      value={questionData.option2}
                      onChange={handleQuestionChange}
                      required
                    />
                       <input
                      type="text"
                      name="option3"
                      placeholder="Option 3"
                      value={questionData.option3}
                      onChange={handleQuestionChange}
                      required
                    />
                       <input
                      type="text"
                      name="option4"
                      placeholder="Option 4"
                      value={questionData.option4}
                      onChange={handleQuestionChange}
                      required
                    />
                       <input
                      type="text"
                      name="answer"
                      placeholder="Answer"
                      value={questionData.answer}
                      onChange={handleQuestionChange}
                      required
                    />
                    <button type="submit">Add Question</button>
                  </form>
                </div>
              </div>
            )}
          </main>
        </section>
      </div>
    </>
  );
}

export default InstructorCourses;