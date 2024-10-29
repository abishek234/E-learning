import React, { useEffect, useState } from 'react';
import './dstyle.css'; // Import your CSS styles
import SideBar from './SideBar';
import Navbar from './Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; 
import axios from 'axios'; // Import Axios
import { Modal } from "antd"; // Import Ant Design Modal
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Tutors = () => {
    const [tutors, setTutors] = useState([]);
    const [openModal, setOpenModal] = useState(false); // State for modal visibility
    const [selectedTutor, setSelectedTutor] = useState(null); // Store selected tutor for editing
    const [newTutorData, setNewTutorData] = useState({
        username: '',
        email: '',
        phno: '',
        dob: '',
        gender: '',
        location: '',
        profession: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const response = await axios.get("http://localhost:7000/api/users/instructors/data");
                setTutors(response.data.instructors); // Set the fetched instructors data
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };

        fetchTutors();
    }, []);

    // Function to handle editing a tutor
    const openEditModal = (tutor) => {
        setSelectedTutor(tutor);
        setNewTutorData({
            username: tutor.username,
            email: tutor.email,
            phno: tutor.phno,
            dob: tutor.dob,
            gender: tutor.gender,
            location: tutor.location,
            profession: tutor.profession,
        });
        setOpenModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTutorData({ ...newTutorData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selectedTutor) {
                // Update existing tutor
                await axios.put(`http://localhost:7000/api/users/${selectedTutor._id}`, newTutorData);
                toast.success('Instructor updated successfully', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            } else {
                // Add new tutor
                await axios.post('http://localhost:7000/api/users/', newTutorData);
                toast.success('Instructor added successfully', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            }
            setOpenModal(false); // Close modal after submission
            setSelectedTutor(null); // Reset selected tutor
            setNewTutorData({ username: '', email: '', phno: '', dob: '', gender: '', location: '', profession: '' }); // Reset form data
            // Optionally refresh tutors list here if needed
        } catch (error) {
            console.error("Error updating or adding instructor:", error);
            toast.error('Failed to update or add instructor', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        }
    };

    async function deleteInstructor(id) {
        if (window.confirm("Are you sure you want to delete this instructor?")) {
            try {
                await axios.delete(`http://localhost:7000/api/users/${id}`);
                setTutors(tutors.filter(tutor => tutor._id !== id));
                toast.success("Instructor deleted successfully");
            } catch (error) {
                console.error("Error deleting instructor:", error);
            }
        }
    }

    return (
        <div style={{ backgroundColor: "#eee" }}>
            <SideBar current={"tutor"} />
            <section id="content">
                <Navbar />
                <main>
                    <div className="table-data" style={{ marginTop: "-10px" }}>
                        <div className="order">
                            <div className="head">
                                <h3>Tutors Info</h3>
                               
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                                <thead>
                                    <tr style={{ borderBottom:'1px solid #ddd' }}>
                                        <th style={{ padding:'10px', textAlign:'start' }}>Instructor Name</th>
                                        <th style={{ padding:'10px', textAlign:'center' }}>Email</th>
                                        <th style={{ padding:'10px', textAlign:'center' }}>Phone Number</th>
                                        <th style={{ padding:'10px', textAlign:'center' }}>Date of Birth</th>
                                        <th style={{ padding:'10px', textAlign:'center' }}>Gender</th>
                                        <th style={{ padding:'10px', textAlign:'center' }}>Location</th>
                                        <th style={{ padding:'10px', textAlign:'center' }}>Profession</th>
                                        <th style={{ padding:'10px', textAlign:'center' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tutors.map((tutor) => (
                                        <tr key={tutor._id} style={{ borderBottom:'1px solid #ddd' }}>
                                            <td style={{ padding:'10px', textAlign:'start' }}>{tutor.username}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{tutor.email}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{tutor.phno}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{tutor.dob}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{tutor.gender}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{tutor.location}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{tutor.profession}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>
                                                <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center" }}>
                                                    {/* Delete Button */}
                                                    <button onClick={() => deleteInstructor(tutor._id)} className="delete-button" style={buttonStyle}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>

                                                    {/* Edit Button */}
                                                    <button onClick={() => openEditModal(tutor)} className="edit-button" style={buttonStyle}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>

                                    ))}
                                </tbody>
                            </table>

                            {/* Edit User Modal */}
                            {openModal && (
                                <div className="modal">
                                    {/* Add styles for scrollable modal */}
                                    <div className="modal-content" style={{
                                        maxHeight: '80vh',
                                        overflowY: 'auto',
                                        paddingBottom:"20px"
                                    }}>
                                        <span className="close" onClick={() => setOpenModal(false)}>&times;</span>
                                        <h2>{selectedTutor ? "Edit Instructor" : "Add Instructor"}</h2>
                                        <form onSubmit={handleSubmit}>
                                            {/* Input fields for each property */}
                                            {Object.keys(newTutorData).map((key) => (
                                                <>
                                                    {key === "dob" ? (
                                                        <>
                                                            {/* Special handling for date input */}
                                                            <label>Date of Birth:</label>
                                                            <input type="date" style={{width:"95%",padding:"10px"}} name={key} value={newTutorData[key]} onChange={handleChange} required />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Regular input fields */}
                                                            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                                            <input type="text" name={key} value={newTutorData[key]} onChange={handleChange} required />
                                                        </>
                                                    )}
                                                </>
                                            ))}
                                            {/* Submit button */}
                                            <button type="submit">{selectedTutor ? "Update Instructor" : "Add Instructor"}</button>
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
    backgroundColor:'#007bff',
    color:'#fff',
    borderRadius:'5px',
    border:'none',
    padding:'5px 10px',
    cursor:'pointer',
};

export default Tutors;