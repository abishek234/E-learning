import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios"; // Import Axios
import "./register.css"

function RegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phno: "",
    password: "",
    dob: "",
    gender: "",
    location: "",
    profession: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      role: "student", // Automatically set role as student
    };

    try {
      const response = await axios.post("http://localhost:7000/api/users/register", dataToSend);

      if (response.status === 200 || response.status === 201) {
        console.log("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      // Handle error response
      if (error.response) {
        setError(error.response.data.message || "An error occurred. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="registration-auth">
        <div className="registration-container">
          <h2>User Registration</h2>
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="registration-input-group">
              <div>
                <div className="registration-text-area">
                  <label>Name: </label>
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="registration-text-area">
                  <label>Email Id:</label>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="registration-input-group">
              <div>
                <div className="registration-text-area">
                  <label>Phone no:</label>
                </div>
                <input
                  type="tel"
                  name="phno"
                  value={formData.phno}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <div className="registration-text-area">
                  <label>Password:</label>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="registration-input-group">
              <div>
                <div className="registration-text-area">
                  <label>Date of Birth:</label>
                </div>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="registration-text-area">
                  <label>Gender:</label>
                </div>
                <select 
                name="gender" 
                value={formData.gender}
                onChange={handleChange}
                style={{ width: "300px", padding: "10px", marginLeft: "10px 0" }}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="other">Other</option>
              </select> 
              </div>
            </div>
            <div className="registration-input-group">
              <div>
                <div className="registration-text-area">
                  <label>Location:</label>
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="registration-text-area">
                  <label>Profession:</label>
                </div>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <span className="registration-error-msg">{error}</span>
            )}
            <div className="registration-btn1">
              <button type="submit">Register</button>
            </div>
          </form>

          {/* Link to login page */}
          <span>
            Already have an account? login
            <Link to="/login"> Here</Link>
          </span>

        </div> 
      </div> 
    </div> 
  );
}

export default RegistrationForm;