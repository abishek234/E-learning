import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditCourse() {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];

  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    course_name: '',
    instructor: '', // This will hold the ObjectId of the instructor
    p_link: '',
  });

  const [formErrors, setFormErrors] = useState({
    course_name: '',
    instructor: '',
    p_link: '',
  });

  const [tutors, setTutors] = useState([]); // State to hold tutors

  // Fetch course details and instructors when component mounts
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/courses/${courseId}`);
        setFormData({
          ...response.data,
          instructor: response.data.instructor._id // Set instructor ID correctly
        }); 
      } catch (error) {
        setError('Error fetching course details');
      }
    };

    const fetchTutors = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/users/instructors/data");
        console.log("Fetched Tutors:", response.data.instructors); // Log fetched tutors
        setTutors(response.data.instructors); // Set the fetched instructors data
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchCourse();
    fetchTutors();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate fields
    let error = '';
    if (name === 'course_name' && value === '') {
      error = 'Course name is required';
    } else if (name === 'instructor' && value === '') {
      error = 'Instructor is required';
    } else if (name === 'p_link' && value === '') {
      error = 'Image Link is required';
    }

    setFormErrors({ ...formErrors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for errors before submitting
    for (const key in formErrors) {
      if (formErrors[key]) {
        setError('Please fill in all required fields.');
        return;
      }
    }

    try {
      const response = await axios.put(`http://localhost:7000/api/courses/${courseId}`, formData);

      if (response.status === 200) {
        toast.success('Updated successfully!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        navigate("/DCourses");
      } else {
        setError("Failed to update course.");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "An error occurred while updating the course.");
      } else {
        setError("An error occurred while updating the course.");
      }
    }
  };

  return (
    <div className='add'>
      <div className='container1'>
        <h2>Edit Course</h2>
        <form onSubmit={handleSubmit} className="addCourse-form">
          <label>Course Name:</label>
          <input type="text" name="course_name" value={formData.course_name} onChange={handleChange} required style={{ width: "100%" }} />
          {formErrors.course_name && <span className='error-msg'>{formErrors.course_name}</span>}

          <label>Instructor:</label>
          <select name="instructor" value={formData.instructor} onChange={handleChange} required style={{ width: "100%" }}>
            <option value="">Select Instructor</option>
            {tutors.map((tutor) => (
              <option key={tutor._id} value={tutor._id}>{tutor.username}</option> // Use _id for instructor's ObjectId
            ))}
          </select>
          {formErrors.instructor && <span className='error-msg'>{formErrors.instructor}</span>}

        

          <label>Image Link:</label>
          <input type="text" name="p_link" value={formData.p_link} onChange={handleChange} required style={{ width: "100%" }} />
          {formErrors.p_link && <span className='error-msg'>{formErrors.p_link}</span>}

          {error && <span className='error-msg'>{error}</span>}
          <br />
          <div className='btn1'>
            <button type="submit">Update</button>
            {/* Back Button */}
            <button type="submit" onClick={() => navigate("/DCourses")} style={{ marginLeft: '10px' }}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;