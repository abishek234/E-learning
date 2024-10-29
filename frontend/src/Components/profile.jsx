import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Performance from "./DashBoard/Performance";
import axios from "axios"; // Import axios

function Profile() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const [userDetails, setUserDetails] = useState(null);



  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }

    async function fetchUserDetails() {
      try {
        const response = await axios.get(`http://localhost:7000/api/users/${id}`);
        console.log(response.data);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchUserDetails();
  }, [authToken, navigate, id]);



  return (
    <div>
      <Navbar page={"profile"} />
      <div className="profile-card" id="pbg" style={{ marginTop: '3%' }}>
        {userDetails ? (
          <>
            <h2 className="profile-name">{userDetails?.username}</h2>
            <div style={{ marginTop: '20px' }}>
              <h4>Email: </h4>
              <p className="profile-email">{userDetails?.email}</p>
            </div>
            <div>
              <h4>Phone Number: </h4>
              <p className="profile-phno">{userDetails?.phno}</p>
            </div>
            <div>
              <h4>Gender: </h4>
              <p className="profile-gender">{userDetails?.gender}</p>
            </div>
            <div>
              <h4>Date of Birth: </h4>
              <p className="profile-dob">{userDetails?.dob}</p>
            </div>
            <div>
              <h4>Profession: </h4>
              <p className="profile-gender">{userDetails?.profession}</p>
            </div>
            <div>
              <h4>Learning courses: </h4>
              {/* Check if learningCourses exists and is an array */}
              <p className="profile-phno">{Array.isArray(userDetails.learningCourses) ? userDetails.learningCourses.length : 0}</p>
            </div>

          </>



        ) : (
          <h2>Loading...</h2>
        )}
      </div>
      <Performance />

    </div>
  );
}

export default Profile;
