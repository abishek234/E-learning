import React, { useEffect, useState } from 'react';
import '../InstructorDashBoard/dstyle.css'; // Import your CSS styles
import SideBar from './SideBar';
import Navbar from './Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; 
import axios from 'axios'; // Import Axios
import { Modal } from "antd"; // Import Ant Design Modal
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Courses = () => {
    const [courses, setCourses] = useState([]); // Ensure this is initialized as an array
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false); // State for modal visibility
    const [isEditMode, setIsEditMode] = useState(false); // State to check if it's edit mode
    const [selectedCourse, setSelectedCourse] = useState(null); // Store selected course for editing
    const [courseData, setCourseData] = useState({
        course_name: '',
        instructor: '',
        p_link: '',
    });
    const [tutors, setTutors] = useState([]); // State to hold tutors

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:7000/api/courses");
                setCourses(response.data); // Set the fetched courses data
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        const fetchTutors = async () => {
            try {
                const response = await axios.get("http://localhost:7000/api/users/instructors/data");
                setTutors(response.data.instructors); // Set the fetched instructors data
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };

        fetchCourses();
        fetchTutors();
    }, []);

    const openAddModal = () => {
        setIsEditMode(false);
        setCourseData({ course_name: '', instructor: '', p_link: '' }); // Reset form data for new course
        setOpenModal(true);
    };

    const openEditModal = (course) => {
        setIsEditMode(true);
        setSelectedCourse(course);
        setCourseData({
            course_name: course.course_name,
            instructor: course.instructor._id, // Assuming instructor ID is stored here
            p_link: course.p_link,
        });
        setOpenModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({ ...courseData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (isEditMode && selectedCourse) {
                // Update existing course
                await axios.put(`http://localhost:7000/api/courses/${selectedCourse._id}`, courseData);
                toast.success('Course updated successfully', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            } else {
                // Add new course
                await axios.post('http://localhost:7000/api/courses', courseData);
                toast.success('Course added successfully', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            }
            setOpenModal(false); // Close modal after submission
            setSelectedCourse(null); // Reset selected course
            setCourseData({ course_name: '', instructor: '', p_link: '' }); // Reset form data
            // Optionally refresh courses list here if needed
        } catch (error) {
            console.error("Error updating or adding course:", error);
            toast.error('Failed to update or add course', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        }
    };

    async function deleteCourse(courseId) {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`http://localhost:7000/api/courses/${courseId}`);
                setCourses(courses.filter(course => course._id !== courseId));
                toast.success("Course deleted successfully");
            } catch (error) {
                console.error("Error deleting course:", error);
            }
        }
    }

    return (
        <>
            <div style={{ backgroundColor: "#eee" }}>
                <SideBar current={"courses"} />
                <section id="content">
                    <Navbar />
                    <main className="t">
                        <div className="table-data" style={{ marginTop: "-10px" }}>
                            <div className="order">
                                <div id="course" className="todo">
                                    <div className="head" style={{ marginTop: "-100px" }}>
                                        <h3>Courses</h3>
                                        <button onClick={openAddModal} style={{
                                            backgroundColor:"darkblue",
                                            borderRadius:"10px",
                                            color:"white",
                                            border:"none",
                                            padding:"8px",
                                            fontWeight:"500",
                                        }}>
                                            Add Course{" "}
                                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>{" "}
                                        </button>
                                    </div>
                                    <ul className="todo-list">
                                        {courses.map((course) => (
                                            <div key={course._id}>
                                                <li className="completed" style={{ marginTop: "10px", backgroundColor:'white', color:'black' }}>
                                                    <p>{course.course_name} <br /> Instructor: {course.instructor ? course.instructor.username : 'Unknown'}</p>
                                                    <div style={{ width:"50px", display:"flex" }}>
                                                        <button onClick={() => openEditModal(course)} style={{ marginLeft:"-100px", marginRight:'40px', backgroundColor:'white' }} className="edit-button">
                                                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                                                        </button>

                                                        <button onClick={() => deleteCourse(course._id)} style={{ backgroundColor:'white' }} className="delete-button">
                                                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                                        </button>
                                                    </div>
                                                </li>
                                            </div>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Add/Edit Course Modal */}
                        {openModal && (
                          <div className="modal">
                            <div className="modal-content">
                                <span className="close" onClick={() => setOpenModal(false)}>&times;</span>
                                <h2>{isEditMode ? "Edit Course" : "Add Course"}</h2>
                                <form onSubmit={handleSubmit}>
                                    <label>Course Name:</label>
                                    <input type="text" name="course_name" value={courseData.course_name} onChange={handleChange} required style={{ width:"100%" }} />
                                    
                                    <label>Instructor:</label>
                                    <select name="instructor" value={courseData.instructor} onChange={handleChange} required style={{ width:"100%" }}>
                                        <option value="">Select Instructor</option>
                                        {tutors.map((tutor) => (
                                            <option key={tutor._id} value={tutor._id}>{tutor.username}</option> // Send tutor's ID
                                        ))}
                                    </select>

                                    <label>Image Link:</label>
                                    <input type="text" name="p_link" value={courseData.p_link} onChange={handleChange} required style={{ width:"100%" }} />

                                    {/* Submit button */}
                                    <button type="submit">{isEditMode ? "Update Course" : "Add Course"}</button>
                                </form>
                            </div>
                          </div>
                            
                        )}

                    </main>
                </section>
            </div>
        </>
    );
};

export default Courses;