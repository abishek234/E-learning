import React, { useState } from 'react';
import './dstyle.css'; // Import your CSS styles
import SideBar from './SideBar';
import Navbar from './Navbar';
import axios from 'axios'; // Import Axios
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';

function AddTutors() {
  const [newInstructor, setNewInstructor] = useState({
    username: '',
    email: '',
    password: '',
    phno: '',
    profession: '',
    gender: '',
    dob: '',
    location: '',
    role: 'instructor', // Set default role as instructor
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor({ ...newInstructor, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7000/api/users/add-instructor", newInstructor);

      if (response.status === 200 || response.status === 201) { 
        toast.success("Instructor added successfully!"); // Show success notification
        // Clear form or update state as needed
        setNewInstructor({
          username: '',
          email: '',
          dob: '',
          gender:'',
          location:'',
          password: '',
          phno: '',
          profession: '',
          role: 'instructor',
        });
      }
    } catch (error) {
      // Handle error response
      if (error.response) {
        setError(error.response.data.message || "Failed to add instructor.");
        toast.error(error.response.data.message || "Failed to add instructor."); // Show error notification
      } else {
        setError("An error occurred while adding the instructor.");
        toast.error("An error occurred while adding the instructor."); // Show error notification
      }
    }
  };

  return (
    <div className="add-tutors-container">
      <SideBar current={"addtutors"} />
      <section id="content">
        <Navbar />
        <main>
          <div className="form-container">
            <h3>Add Instructor</h3>
            {error && <span className="error-msg">{error}</span>}
            <form onSubmit={handleSubmit} className="instructor-form">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={newInstructor.username}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newInstructor.email}
                onChange={handleChange}
                required
              />
              <select 
                name="gender" 
                value={newInstructor.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>  
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={newInstructor.dob}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phno"
                placeholder="Phone Number"
                value={newInstructor.phno}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newInstructor.password}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="profession"
                placeholder="Profession"
                value={newInstructor.profession}
                onChange={handleChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={newInstructor.location}
                onChange={handleChange}
              />
              <button type="submit" className="submit-button">Add Instructor</button>
            </form>
          </div>
        </main>
      </section>


    </div>
  );
}

export default AddTutors;