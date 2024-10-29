import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from './SideBar';
import Navbar from './Navbar';
import './dstyle.css'; // Import your CSS styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MaterialsTable = () => {
    const [materials, setMaterials] = useState([]);
    const [courses, setCourses] = useState([]); // State for courses
    const [selectedCourse, setSelectedCourse] = useState(''); // State for selected course
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [materialsPerPage] = useState(5); // Number of materials per page
    const [editModalVisible, setEditModalVisible] = useState(false); // State for edit modal visibility
    const [selectedMaterial, setSelectedMaterial] = useState(null); // Store selected material for editing
    const navigate = useNavigate();

    // Fetch all materials and courses on component mount
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/materials/'); // Adjust this endpoint as needed
                setMaterials(response.data);
            } catch (error) {
                console.error('Error fetching materials:', error);
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

        fetchMaterials();
        fetchCourses();
    }, []);

    // Delete a material
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this material?")) {
            try {
                await axios.delete(`http://localhost:7000/api/materials/${id}`);
                setMaterials(materials.filter(material => material._id !== id));
                toast.success("Material deleted successfully");
            } catch (error) {
                console.error('Error deleting material:', error);
            }
        }
    };

    // Open edit modal with selected material data
    const openEditModal = (material) => {
        setSelectedMaterial(material);
        setEditModalVisible(true);
    };

    // Handle material update
    const handleUpdateMaterial = async (e) => {
        e.preventDefault();
        try {
            console.log("Updating material with ID:", selectedMaterial._id);
            await axios.put(`http://localhost:7000/api/materials/update/${selectedMaterial._id}`, selectedMaterial);
            setMaterials(materials.map(material => 
                material._id === selectedMaterial._id ? selectedMaterial : material));
            toast.success("Material updated successfully");
            setEditModalVisible(false); // Close modal after submission
            setSelectedMaterial(null); // Reset selected material
        } catch (error) {
            console.error("Error updating material:", error);
        }
    };

    return (
        <div style={{ backgroundColor: "#eee" }}>
            <SideBar current={"material"} />
            <section id="content">
                <Navbar />
                <main>
                    <div className="table-data" style={{ marginTop: "-10px" }}>
                        <div className="order">
                            <div className="head">
                                <h3>Materials Info</h3>
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
                                        <th style={{ padding: '10px', textAlign: 'start' }}>Title</th>
                                        <th style={{ padding: '10px', textAlign: 'start' }}>Description</th>
                                        <th style={{ padding: '10px', textAlign: 'center' }}>YouTube Link</th>
                                        <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materials.map(material => (
                                        <tr key={material._id} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td style={{ padding: '10px', textAlign: 'start' }}>{material.course.course_name}</td>
                                            <td style={{ padding: '10px', textAlign: 'start' }}>{material.title}</td>
                                            <td style={{ padding: '10px', textAlign: 'start' }}>{material.description}</td>
                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                {material.y_link}
                                            </td>
                                            <td style={{ padding: '10px', textAlign: 'center' }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <button onClick={() => openEditModal(material)} className="edit-button" style={buttonStyle}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button onClick={() => handleDelete(material._id)} className="delete-button" style={buttonStyle}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Edit Material Modal */}
                            {editModalVisible && selectedMaterial && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <span className="close" onClick={() => setEditModalVisible(false)}>&times;</span>
                                        <h2>Edit Material</h2>
                                        <form onSubmit={handleUpdateMaterial}>
                                            <input
                                                type="text"
                                                name="title"
                                                placeholder="Title"
                                                value={selectedMaterial.title}
                                                onChange={(e) => setSelectedMaterial({ ...selectedMaterial, title: e.target.value })}
                                                required
                                            />
                                            <textarea
                                                name="description"
                                                placeholder="Description"
                                                value={selectedMaterial.description}
                                                onChange={(e) => setSelectedMaterial({ ...selectedMaterial, description: e.target.value })}
                                                required
                                            />
                                            <input
                                                type="url"
                                                name="y_link"
                                                placeholder="YouTube Link"
                                                value={selectedMaterial.y_link}
                                                onChange={(e) => setSelectedMaterial({ ...selectedMaterial, y_link: e.target.value })}
                                                required
                                            />
                                            <button type="submit">Update Material</button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {/* Add pagination controls here if needed */}

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

export default MaterialsTable;