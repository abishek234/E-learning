import React, { useState, useEffect } from "react";


import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import Axios
import Confetti from "react-dom-confetti";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import img from './images/logo.jpg';
import seal from './images/seal.png';

const Certificate = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  const [error, setError] = useState(false);
  const courseId = window.location.pathname.split("/")[2];
  const [course, setCourse] = useState({
    course_name: "",
    instructor: "",
    price: null,
    description: "",
    y_link: "",
    p_link: "",
  });
  const [marks, setMarks] = useState(null); // State to hold marks

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }

    async function fetchUserDetails() {
      try {
        const response = await axios.get(`http://localhost:7000/api/users/${id}`);
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(true);
      }
    }

    async function fetchCourse() {
      try {
        const response = await axios.get(`http://localhost:7000/api/courses/${courseId}`);
        if (response.data) {
          setCourse(response.data); // Set the fetched course data
          // Fetch marks for this course
          const marksResponse = await axios.get(`http://localhost:7000/api/assessments/marks/${id}/${courseId}`);
          
          if (marksResponse.data.length > 0) { // Check if there are any elements in the array
            setMarks(marksResponse.data[0].marks); // Access marks from the first element of the array
        } else {
            console.error("No marks found for this course.");
        }
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(true);
      }
    }

    fetchCourse();
    fetchUserDetails();
  }, [authToken, navigate, id, courseId]);

  const generateCertificateNumber = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const currentDate = formatDate(new Date());
  const certificateNumber = generateCertificateNumber();

  const leftConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 80,
    elementCount: 270,
    dragFriction: 0.1,
    duration: 4000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#3498db", "#e74c3c", "#27ae60"],
  };

  const rightConfig = {
    angle: 90,
    spread: 180,
    startVelocity: 40,
    elementCount: 70,
    dragFriction: 0.1,
    duration: 3000,
    stagger: 3,
    width: "10px",
    height: "10px",
    colors: ["#3498db", "#e74c3c", "#27ae60"],
  };

  const [pdfDownloading, setPdfDownloading] = useState(false);

  const handleDownloadPDF = () => {
    setPdfDownloading(true);
  
    const certificateElement = document.getElementById("certificate");
  
    if (certificateElement) {
      html2canvas(certificateElement).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
  
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
  
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("certificate.pdf");
  
        setPdfDownloading(false);
      });
    } else {
      console.error("Certificate element not found.");
      setPdfDownloading(false);
    }
  };
  

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "0", padding: "20px" }}>
      <Confetti active={!loading} config={leftConfig} />
      <Confetti active={!loading} config={leftConfig} />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          id="certificate"
          style={{
            maxWidth: "600px",
            margin: "50px auto",
            textAlign: "center",
            borderRadius: "15px",
            paddingBottom: "30px",
            backgroundColor: "#f9f9f9", // Light background color
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)", // Soft shadow
            borderTop: "5px solid #3498db" // Decorative border
          }}
        >
          <br />
          <img
            src={img}
            alt="Logo"
            style={{
              width: "100px",
              height: "auto",
              marginBottom: "10px",
              borderRadius: "50%",
              padding: "5px",
              border:"2px solid #3498db" // Border around logo
            }}
          />
          <h1 style={{ color: "#3498db", marginBottom: "12px", fontSize: "30px" }}>
            Certificate of Completion
          </h1>
          <p style={{ color: "#555", marginBottom:"8px", fontSize:"18px" }}>
            This is to certify that{" "}
            <span style={{ fontWeight: "bold", color:"#e74c3c", fontSize:"26px" }}>
              {userDetails?.username}
            </span>
          </p>
          <p style={{ color:"#555", marginBottom:"8px", fontSize:"18px" }}>
            has successfully completed the course{" "}
            <span style={{ color:"#27ae60", fontWeight:"bold", fontSize:"25px" }}>
              {course.course_name.length < 10 ? course.course_name + " Tutorial" : course.course_name}
            </span>
          </p>
          {/* Display Marks */}
          {marks !== null && (
            <p style={{ color:"#555", marginBottom:"8px", fontSize:"18px" }}>
              Marks Obtained: 
              <span style={{ color:"#27ae60", fontWeight:"bold", fontSize:"25px" }}>
                {marks}
              </span>
            </p>
          )}
          <p style={{ color:"#6c757d", fontSize:"16px" }}>
            Issued on {currentDate}
          </p>
          <p style={{ color:"#6c757d", fontSize:"16px" }}>
            Certificate ID: {certificateNumber}
          </p>
          <img
            src={seal}
            alt="Seal"
            style={{
              width:"100px",
              height:"auto",
              marginTop:"30px",
              borderTop:"2px solid #333",
            }}
          />
          <Confetti active={!loading} config={rightConfig} />
        </div>
      )}
      
      <button
        onClick={handleDownloadPDF}
        style={{
          marginTop:"20px",
          padding:"10px 20px",
          fontSize:"18px",
          backgroundColor:"#3498db",
          color:"#fff",
          borderRadius:"5px",
          border:"none",
          cursor:"pointer"
        }}
      >
        {pdfDownloading ? "Downloading..." : "Download Certificate as PDF"}
      </button>
      <button
        onClick={() => navigate(`/profile`)}
        style={{
          marginTop:"20px",
          padding:"10px 20px",
          fontSize:"18px",
          backgroundColor:"#3498db",
          color:"#fff",
          borderRadius:"5px",
          border:"none",
          cursor:"pointer",
          marginLeft:"105px"
        }}
      >
        Back
      </button>
    </div>
  );
};

export default Certificate;