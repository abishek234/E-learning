import React, { useState } from "react";
import "./dstyle.css"; // Import your CSS styles
import SideBar from "./SideBar";
import Navbar from "./Navbar";
import axios from "axios"; // Import Axios
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminMail() {
  const [formData, setFormData] = useState({
    course_name: '',
    course_description: '',
    y_link: '',
    p_link: ''
  });

  const name = localStorage.getItem('name');
 
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.course_name || !formData.course_description || !formData.y_link || !formData.p_link) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/api/users/instructor/send-email', {
        from_name: name,
        to_email: 'abishekriya0108@gmail.com', // Change this to the recipient's email if needed
        course_name: formData.course_name,
        course_description: formData.course_description,
        y_link: formData.y_link,
        p_link: formData.p_link,
      });

      if (response.status === 200) {
        toast.success('Email sent successfully!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        
        // Reset form after successful submission
        setFormData({
          course_name: '',
          course_description: '',
          y_link: '',
          p_link: ''
        });
        setError('');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error('Failed to send email.', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      setError('Failed to send email.');
    }
  };

  return (
    <div style={{ backgroundColor: "#eee" }}>
      <SideBar current={"admin-mail"} />
      <section id="content">
        <Navbar />
        <main>
          <div className="form-container">
            <h2>Send Mail to Admin</h2>
            {error && <span className='error-msg' style={{ color:'red', fontWeight:'bold', textAlign:'center' }}>{error}</span>}
            <form onSubmit={handleSubmit} className="instructor-form">
              <label>Course Name:</label>
              <input 
                type="text" 
                name="course_name" 
                value={formData.course_name} 
                onChange={handleChange} 
                required 
                style={{ width: "100%" }} 
              />

              <label>Course Description:</label>
              <textarea 
                name="course_description" 
                value={formData.course_description} 
                onChange={handleChange} 
                required 
                style={{ width: "100%", height: "100px" }} 
              />

              <label>Video Link:</label>
              <input 
                type="text" 
                name="y_link" 
                value={formData.y_link} 
                onChange={handleChange} 
                required 
                style={{ width: "100%" }} 
              />

              <label>Image Link:</label>
              <input 
                type="text" 
                name="p_link" 
                value={formData.p_link} 
                onChange={handleChange} 
                required 
                style={{ width: "100%" }} 
              />

              <br />
              <button type="submit" className="submit-button">Send Mail</button>
            </form>
          </div>
        </main>
      </section>
    </div>
  );
}

export default AdminMail;