import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.pathname.split("/")[2];

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phno: '',
    dob: '', // This will be formatted as yyyy-MM-dd
    gender: '',
    location: '',
    profession: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`http://localhost:7000/api/users/${userId}`);
        // Convert date format from dd/MM/yyyy to yyyy-MM-dd
        const fetchedData = response.data;
        
        setFormData({ ...fetchedData});
      } catch (err) {
        setError('Error fetching user data');
      }
    }
    fetchUser();
  }, [userId]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`http://localhost:7000/api/users/${userId}`, formData);
      if (response.status === 200) {
        toast.success('User updated successfully', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        navigate("/users"); // Navigate back to users list
      }
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  return (
    <div className='add'>
      <div className='container1'>
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit} className="addCourse-form">
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required style={{ width: "100%" }} />
          
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "100%" }} />
          
          <label>Phone Number:</label>
          <input type="text" name="phno" value={formData.phno} onChange={handleChange} required style={{ width: "100%" }} />
          
          <label>Date of Birth:</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={{ width: "100%",height:"35px" }} />
          
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required style={{ width: "100%" }}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required style={{ width: "100%" }} />
          
          <label>Profession:</label>
          <input type="text" name="profession" value={formData.profession} onChange={handleChange} required style={{ width: "100%" }} />

          {error && <span className='error-msg' style={{ color:'red', fontWeight:'bold', textAlign:'center' }}>{error}</span>}
          
          <br />
          <div className='btn1'>
            <button type="submit">Update</button>
            <button type="submit" onClick={() => navigate("/DUsers")} style={{ marginLeft: '10px' }}>Back</button>
            </div> 
        </form>
      </div>
    </div>
  );
}

export default EditUser;