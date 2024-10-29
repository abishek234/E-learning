import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import Navbar from "./Navbar";
import axios from "axios"; // Import Axios
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const login = async (e) => {
    e.preventDefault();
    try {
      // Use Axios to make the POST request
      const response = await axios.post("http://localhost:7000/api/users/login", {
        email,
        password,
      });

      // Check if response is successful
      if (response.status === 200) {
        const data = response.data;

        // Store token and user details in local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);
        localStorage.setItem("id", data.id);

        // Set user context
        setUser({ name: data.name, email: data.email, id: data.id });

        // Show success notification
        toast.success("Login successful!");

        // Navigate based on role
        if (data.role === "admin") {
          navigate("/dashboard");
        } else if (data.role === "instructor") {
          navigate("/instructordashboard");
        } else {
          navigate("/courses");
        }
      }
    } catch (error) {
      // Handle error response
      if (error.response) {
        // Server responded with a status other than 200 range
        toast.error(error.response.data.message || "An error occurred. Please try again.");
      } else {
        // Network error or no response from server
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer /> {/* Add ToastContainer */}
      <div className="auth">
        <div className="container">
          <h3>Welcome!</h3>
          <br />
          <h2>Login</h2>
          <br />
          <form autoComplete="off" className="form-group" onSubmit={login}>
            <label htmlFor="email">Email Id :</label>
            <input
              type="email"
              className="form-control"
              style={{ width: "100%", marginRight: "50px" }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <br />
            <label htmlFor="password">Password : </label>
            <input
              type="password"
              className="form-control"
              style={{ width: "100%" }}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <br />
            <div className="btn1">
              <button type="submit" className="btn btn-success btn-md mybtn">
                LOGIN
              </button>
            </div>
          </form>
          
          <span>
            Don't have an account? Register
            <Link to="/register"> Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;