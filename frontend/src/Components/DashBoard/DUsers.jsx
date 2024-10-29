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

const Users = () => {
    const [users, setUsers] = useState([]);
    const [openModal, setOpenModal] = useState(false); // State for modal visibility
    const [selectedUser, setSelectedUser] = useState(null); // Store selected user for editing
    const [newUserData, setNewUserData] = useState({
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
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:7000/api/users/");
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Function to handle editing a user
    const openEditModal = (user) => {
        setSelectedUser(user);
        setNewUserData({
            username: user.username,
            email: user.email,
            phno: user.phno,
            dob: user.dob,
            gender: user.gender,
            location: user.location,
            profession: user.profession,
        });
        setOpenModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUserData({ ...newUserData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (selectedUser) {
                // Update existing user
                await axios.put(`http://localhost:7000/api/users/${selectedUser._id}`, newUserData);
                toast.success('User updated successfully', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            } else {
                // Add new user
                await axios.post('http://localhost:7000/api/users/', newUserData);
                toast.success('User added successfully', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
            }
            setOpenModal(false); // Close modal after submission
            setSelectedUser(null); // Reset selected user
            setNewUserData({ username: '', email: '', phno: '', dob: '', gender: '', location: '', profession: '' }); // Reset form data
            // Optionally refresh users list here if needed
        } catch (error) {
            console.error("Error updating or adding user:", error);
            toast.error('Failed to update or add user', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        }
    };

    async function deleteUser(id) {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:7000/api/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
                toast.success("User deleted successfully");
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    }

    return (
        <div style={{ backgroundColor: "#eee" }}>
            <SideBar current={"user"} />
            <section id="content">
                <Navbar />
                <main>
                    <div className="table-data" style={{ marginTop: "-10px" }}>
                        <div className="order">
                            <div className="head">
                                <h3>Users Info</h3>
                               
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                                <thead>
                                    <tr style={{ backgroundColor:'#007bff', color:'#ffffff' }}>
                                        <th style={{ padding:'10px', textAlign:'start' }}>Username</th>
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
                                    {users
                                    .filter(user => user.role === "student")
                                    .map((user) => (
                                        <tr key={user._id} style={{ borderBottom:'1px solid #ddd' }}>
                                            <td style={{ padding:'10px', textAlign:'start' }}>{user.username}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{user.email}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{user.phno}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{user.dob}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{user.gender}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{user.location}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>{user.profession}</td>
                                            <td style={{ padding:'10px', textAlign:'center' }}>
                                                <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center" }}>
                                                    {/* Delete Button */}
                                                    <button onClick={() => deleteUser(user._id)} className="delete-button" style={buttonStyle}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>

                                                    {/* Edit Button */}
                                                    <button onClick={() => openEditModal(user)} className="edit-button" style={buttonStyle}>
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
                                    <div className="modal-content" style={{maxHeight : "80vh", overflowY : "auto", paddingBottom: "20px"}}>                                        <span className="close" onClick={() => setOpenModal(false)}>&times;</span>
                                        <h2>{selectedUser ? "Edit User" : "Add User"}</h2>
                                        <form onSubmit={handleSubmit}>
                                            {/* Input fields for each property */}
                                            {Object.keys(newUserData).map((key) => (
                                                <>
                                                    {key === "dob" ? (
                                                        <>
                                                            {/* Special handling for date input */}
                                                            <label>Date of Birth:</label>
                                                            <input type="date" style={{width:"95%",padding:"10px"}} name={key} value={newUserData[key]} onChange={handleChange} required />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Regular input fields */}
                                                            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                                            <input type="text" name={key} value={newUserData[key]} onChange={handleChange} required />
                                                        </>
                                                    )}
                                                </>
                                            ))}
                                            {/* Submit button */}
                                            <button type="submit">{selectedUser ? "Update User" : "Add User"}</button>
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

export default Users;