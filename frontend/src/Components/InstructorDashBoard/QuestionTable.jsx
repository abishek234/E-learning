import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from './SideBar';
import Navbar from './Navbar';
import './dstyle.css'; // Import your CSS styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "antd"; // Import Ant Design Modal
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuestionsTable = () => {
    const [questions, setQuestions] = useState([]);
    const [courses, setCourses] = useState([]); // State for courses
    const [selectedCourse, setSelectedCourse] = useState(''); // State for selected course
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [questionsPerPage] = useState(5); // Number of questions per page
    const [editModalVisible, setEditModalVisible] = useState(false); // State for edit modal visibility
    const [selectedQuestion, setSelectedQuestion] = useState(null); // Store selected question for editing
    const navigate = useNavigate();

    // Fetch all questions and courses on component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/questions/question/data');
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/courses'); // Adjust this endpoint as needed
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchQuestions();
        fetchCourses();
    }, []);

    // Delete a question
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            try {
                await axios.delete(`http://localhost:7000/api/questions/${id}`);
                setQuestions(questions.filter(question => question._id !== id));
                toast.success("Question deleted successfully");
            } catch (error) {
                console.error('Error deleting question:', error);
            }
        }
    };

    // Open edit modal with selected question data
    const openEditModal = (question) => {
        setSelectedQuestion(question);
        setEditModalVisible(true);
    };

    // Handle material update
    const handleUpdateQuestion = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:7000/api/questions/${selectedQuestion._id}`, selectedQuestion);
            setQuestions(questions.map(question => 
                question._id === selectedQuestion._id ? selectedQuestion : question));
            toast.success("Question updated successfully");
            setEditModalVisible(false); // Close modal after submission
            setSelectedQuestion(null); // Reset selected question
        } catch (error) {
            console.error("Error updating question:", error);
        }
    };

    return (
        <div style={{ backgroundColor: "#eee" }}>
            <SideBar current={"question"} />
            <section id="content">
                <Navbar />
                <main>
                    <div className="table-data" style={{ marginTop: "-10px" }}>
                        <div className="order">
                            <div className="head">
                                <h3>Questions Info</h3>
                            </div>

                            {/* Course Filter Dropdown */}
                            <div style={{ marginBottom: '20px' }}>
                                <label htmlFor="courseFilter">Filter by Course:</label>
                                <select 
                                    id="courseFilter" 
                                    value={selectedCourse} 
                                    onChange={(e) => {
                                        setSelectedCourse(e.target.value);
                                        setCurrentPage(1); // Reset to first page when filtering
                                    }}
                                >
                                    <option value="">All Courses</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course.course_name}>{course.course_name}</option>
                                    ))}
                                </select>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                                        <th style={{ padding: '10px', textAlign: 'start' }}>Course</th>
                                        <th style={{ padding: '10px', textAlign: 'start' }}>Question</th>
                                        <th style={{ padding: '10px', textAlign: 'center' }}>Options</th>
                                        <th style={{ padding: '10px', textAlign: 'center' }}>Answer</th>
                                        <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map(question => (
                                        <tr key={question._id} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td style={{ padding: '10px', textAlign: 'start' }}>{question.course.course_name}</td>
                                            <td style={{ padding: '10px', textAlign: 'start' }}>{question.question}</td>
                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                {`${question.option1}, ${question.option2}, ${question.option3}, ${question.option4}`}
                                            </td>
                                            <td style={{ padding: '10px', textAlign: 'center' }}>{question.answer}</td>
                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <button onClick={() => openEditModal(question)} className="edit-button" style={buttonStyle}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button onClick={() => handleDelete(question._id)} className="delete-button" style={buttonStyle}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Edit Question Modal */}
                            {editModalVisible && selectedQuestion && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <span className="close" onClick={() => setEditModalVisible(false)}>&times;</span>
                                        <h2>Edit Question</h2>
                                        <form onSubmit={handleUpdateQuestion}>
                                            <input
                                                type="text"
                                                name="question"
                                                placeholder="Question"
                                                value={selectedQuestion.question}
                                                onChange={(e) => setSelectedQuestion({ ...selectedQuestion, question: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="option1"
                                                placeholder="Option 1"
                                                value={selectedQuestion.option1}
                                                onChange={(e) => setSelectedQuestion({ ...selectedQuestion, option1: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="option2"
                                                placeholder="Option 2"
                                                value={selectedQuestion.option2}
                                                onChange={(e) => setSelectedQuestion({ ...selectedQuestion, option2: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="option3"
                                                placeholder="Option 3"
                                                value={selectedQuestion.option3}
                                                onChange={(e) => setSelectedQuestion({ ...selectedQuestion, option3: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="option4"
                                                placeholder="Option 4"
                                                value={selectedQuestion.option4}
                                                onChange={(e) => setSelectedQuestion({ ...selectedQuestion, option4: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="text"
                                                name="answer"
                                                placeholder="Correct Answer"
                                                value={selectedQuestion.answer}
                                                onChange={(e) => setSelectedQuestion({ ...selectedQuestion, answer: e.target.value })}
                                                required
                                            />
                                            <button type="submit">Update Question</button>
                                        </form>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                </main>
            </section>
        </div>
    );
};

const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
};

export default QuestionsTable;