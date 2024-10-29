import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Courses() {
    const [courses, setCourses] = useState([]);
    const userId = localStorage.getItem("id");
    const navigate = useNavigate();
    const [enrolled, setEnrolled] = useState([]);
    const authToken = localStorage.getItem('token');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/courses/');
                setCourses(response.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        const fetchEnrolledCourses = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:7000/api/learning/${userId}`);
                    console.log(response.data);
                    let arr = response.data.map(item => item._id); // Use map to extract course IDs
                    setEnrolled(arr);
                    console.log("Enrolled courses:", arr);
                    console.log("Courses:", enrolled);
                } catch (error) {
                    console.error("Error fetching enrolled courses:", error);
                }
            }
        };

        fetchCourses();
        fetchEnrolledCourses();
    }, [userId]);

    function enrollCourse(courseId) {
      if (authToken) {
          const enrollRequest = {
              userId: userId,
              courseId: courseId
          };
          axios.post('http://localhost:7000/api/learning', enrollRequest)
              .then((response) => {
                  if (response.status === 200 || response.status === 201) {
                      toast.success('Course Enrolled successfully', {
                          position: 'top-right',
                          autoClose: 1000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: false,
                      });
  
                      // Update the enrolled state
                      setEnrolled(prevEnrolled => [...prevEnrolled, courseId]);
  
                      setTimeout(() => {
                          navigate(`/course/${courseId}`);
                      }, 2000);
                  }
              })
              .catch((error) => {
                  console.error('Enrollment error:', error);
              });
      } else {
          toast.error('You need to login to continue', {
              position: 'top-right',
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
          });
          setTimeout(() => {
              navigate('/login');
          }, 2000);
      }
  }

    return (
        <div>
            <Navbar page={"courses"} />
            <div className="courses-container" style={{ marginTop: "20px" }}>
                {courses.map((course) => (
                    <div key={course._id} className="course-card">
                        <img src={course.p_link} alt={course.course_name} className="course-image" />
                        <div className="course-details">
                            <h3 className="course-heading">
                                {course.course_name.length < 8
                                    ? `${course.course_name} Tutorial`
                                    : course.course_name || "Unnamed Course" // Fallback for undefined course names
                                }
                            </h3>
                            <p className="course-description">Tutorial by {course.instructor?.username || "Unknown Instructor"}</p> {/* Access instructor username */}
                        </div>
                        {enrolled.includes(course._id) ? (
                            <button className="enroll-button" style={{ color: '#F4D03F', backgroundColor: 'darkblue', fontWeight: 'bold' }} onClick={() => navigate("/learnings")}>
                                Enrolled
                            </button>
                        ) : (
                            <button className="enroll-button" onClick={() => enrollCourse(course._id)}>
                                Enroll
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Courses;