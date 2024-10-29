import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditInstructor() {
  const navigate = useNavigate();
  const location = useLocation();
  const instructorId = location.pathname.split("/")[2];

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phno: '',
    dob: '',
    gender: '', // This will hold the selected gender
    location: '',
    profession: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInstructor() {
      try {
        const response = await axios.get(`http://localhost:7000/api/users/${instructorId}`);
        setFormData(response.data);
        
      } catch (err) {
        setError('Error fetching instructor data');
      }
    }
    fetchInstructor();
  }, [instructorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:7000/api/users/${instructorId}`, formData);
      if (response.status === 200) {
        toast.success('Instructor updated successfully', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        navigate("/Dtutors"); // Navigate back to tutors list
      }
    } catch (err) {
      setError('Failed to update instructor');
      console.error(err);
    }
  };

  return (
    <div className='add'>
      <div className='container1'>
        <h2>Edit Instructor</h2>
        <form onSubmit={handleSubmit} className="addCourse-form">
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required style={{ width: "100%" }} />
          
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: "100%" }} />
          
          <label>Phone Number:</label>
          <input type="text" name="phno" value={formData.phno} onChange={handleChange} required style={{ width: "100%" }} />
          
          <label>Date of Birth:</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={{ width: "100%" }} />
          
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
            <button type="submit" onClick={() => navigate("/DTutors")} style={{ marginLeft: '10px' }}>Back</button>
            </div> 
        </form>
      </div>
    </div>
  );
}

export default EditInstructor;