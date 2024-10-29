import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import { Progress } from "antd";
import { Button, Modal } from "antd";
import Feedback from "./Feedback";
import Forum from "./forum";

const Course = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [course, setCourse] = useState({
    course_name: "",
    instructor: {},
    price: null,
    description: "",
    y_link: "",
    p_link: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState(null);
  const [played, setPlayed] = useState(0);
  const [materials, setMaterials] = useState([]); // State for storing materials
  const [currentVideoUrl, setCurrentVideoUrl] = useState(""); // State for current video URL
  const [completedVideos, setCompletedVideos] = useState(new Set()); // Track completed videos
  const userId = localStorage.getItem("id");
  
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];
  const playerRef = useRef(null);

  // Fetch course and materials
  useEffect(() => {
    async function fetchCourse() {
      try {
        const response = await axios.get(`http://localhost:7000/api/courses/${courseId}`);
        setCourse(response.data);
        
        // Fetch materials for this course
        const materialsResponse = await axios.get(`http://localhost:7000/api/materials/material/${courseId}`);
        setMaterials(materialsResponse.data); // Set fetched materials

        // Automatically set the first material's video link as current video URL
        if (materialsResponse.data.length > 0) {
          setCurrentVideoUrl(materialsResponse.data[0].y_link); // Set to first material's video link
        } else {
          setCurrentVideoUrl(course.y_link); // Fallback to course's main video if no materials
        }

        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  // Fetch user's progress for this course
  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await axios.get(`http://localhost:7000/api/progress/${userId}/${courseId}`);
        
        if (response.data) {
          // Update played time and completed videos based on fetched progress
          setPlayed(response.data.playedTime || 0);
          setCompletedVideos(new Set(response.data.completedVideos)); // Assuming completedVideos is an array of IDs
          duration && setDuration(response.data.duration || duration); // Update duration if needed
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    }

    fetchProgress();
  }, [userId, courseId]);

  // Handle duration update
  const handleDuration = () => {
    if (playerRef.current) {
      setDuration(playerRef.current.getDuration());
    }
  };

  // Handle video progress
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(played); // Seek to the played time when it changes
    }
  }, [played]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Something went wrong!</div>;

  // Function to handle material click
  const handleMaterialClick = (y_link) => {
    setCurrentVideoUrl(y_link); // Update current video URL
    setPlayed(0); // Reset played time
  };

  // Function to mark a video as completed and update backend progress
  const markAsCompleted = async (materialId) => {
    try {
      await axios.put('http://localhost:7000/api/progress/update-progress', {
        userId,
        courseId,
        playedTime: played,
        duration,
        videoId: materialId // Send the ID of the material being marked as complete
      });

      setCompletedVideos((prev) => new Set(prev).add(materialId)); // Add the material ID to the completed set
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Calculate progress percentage based on completed videos
  const totalVideos = materials.length;
  const completedPercentage = totalVideos > 0 ? Math.ceil((completedVideos.size / totalVideos) * 100) : 0;

  return (
    <div className="course-container">
      <h3 className="course-title">
        The Complete {course.course_name} Course - 2024
      </h3>
      
      {/* Centered Video Player */}
      <div className="video-player-container">
        <ReactPlayer 
          ref={playerRef} 
          url={currentVideoUrl || course.y_link} 
          controls 
          width="80%" 
          height="440px" 
          onDuration={handleDuration} 
        />
      </div>

      {/* Materials Display */}
      <div className="materials-container">
        {materials.map((material) => (
          <div key={material._id} className="material-card">
            <h4 className="material-title" onClick={() => handleMaterialClick(material.y_link)}>
              {material.title}
            </h4>
            <p className="material-description">{material.description}</p>
            <Button className="back-button" onClick={() => markAsCompleted(material._id)}>Mark as Completed</Button>
          </div>
        ))}
      </div>

      <br />
      
      {/* Back Button */}
      <Button className="back-button" onClick={() => navigate("/learnings")}>Back</Button>

      {/* Progress Report */}
      <div className="progress-report">
        <h3>Progress:</h3>
        <Progress percent={completedPercentage} status="active" />
        <p>You have completed {completedPercentage}% of this course.</p>
      </div>

      

      {/* Show Quiz Link if all videos are completed */}
      {completedVideos.size === totalVideos && (
        <Button className="back-button" onClick={() => navigate(`/assessment/${courseId}`)}>Take Quiz</Button>
      )}
      <br />

<button className="enroll-button" onClick={()=>navigate(`/discussion/${courseId}`)}>Discussion/Feedback</button>

      {/* Feedback Component */}
      {/* <Feedback courseid={courseId} /> */}
      
      {/* Modal for Notes */}
      <Modal title="Note:" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)}>
        <p>Complete the course to access all features.</p>
      </Modal>
    </div>
  );
};

export default Course;