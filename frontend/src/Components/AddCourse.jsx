import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function AddCourse() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    courseName: '',
    tutor: '',
    photo: '',
  });
  const [tutors, setTutors] = useState([]); // State to hold tutors

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send
    const dataToSend = {
      course_name: formData.courseName,
      p_link: formData.photo,
      instructor: formData.tutor, // Send the selected tutor's username or ID
    };

    try {
      const response = await axios.post('http://localhost:7000/api/courses', dataToSend);

      if (response.status === 200 || response.status === 201) {
        console.log('Course added successfully!');
        navigate('/DCourses');
      } else {
        setError("Failed to add course.");
      }
    } catch (error) {
      // Handle error response
      if (error.response) {
        setError(error.response.data.message || "An error occurred while adding the course.");
      } else {
        setError("An error occurred while adding the course.");
      }
    }
  };

  return (
    <div className='add'>
      <div className='container1'>
        <h2>Course Registration</h2>
        <form onSubmit={handleSubmit} className="addCourse-form">
          <label>Name:</label>
          <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} required style={{ width: "100%" }} />
          
          <label>Instructor:</label>
          <select name="tutor" value={formData.tutor} onChange={handleChange} required style={{ width: "100%" }}>
            <option value="">Select Tutor</option>
            {tutors.map((tutor) => (
              <option key={tutor._id} value={tutor._id}>{tutor.username}</option> // Send tutor's ID
            ))}
          </select>

          
          
          <label>Image Link:</label>
          <input type="text" name="photo" value={formData.photo} onChange={handleChange} required style={{ width: "100%" }} />
          
          {error && <span className='error-msg'>{error}</span>}
          <br />
          <div className='btn1'>
            <button type="submit">Add Course</button>
            {/* Back Button */}
            <button type="submit" onClick={() => navigate("/DCourses")} style={{ marginLeft: '10px' }}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCourse;