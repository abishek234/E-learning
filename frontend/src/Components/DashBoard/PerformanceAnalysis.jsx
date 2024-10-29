import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary components
import './dstyle.css';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import Navbar from './Navbar';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceAnalysis = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [chartData, setChartData] = useState({ datasets: [] });
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");

  // Fetch enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      
        try {
          const response = await axios.get('http://localhost:7000/api/courses');
          console.log("Fetched Courses:", response.data);
          setEnrolledCourses(response.data);

          if (response.data.length > 0) {
            setSelectedCourseId(response.data[0]._id); // Default to first course
            fetchPerformance(response.data[0]._id); // Fetch performance for the first course
          }
        } catch (err) {
          console.error("Error fetching courses:", err);
        
      }
    };
    fetchCourses();
  }, []);

  // Fetch performance data for selected course
  const fetchPerformance = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/progress/${courseId}`);
      if (response.data) {
        updateChartData(response.data); // Pass the object directly
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (err) {
      console.error("Error fetching performance data:", err);
    }
  };

  // Update chart data based on performance data
  const updateChartData = (data) => {
    if (!data || typeof data !== 'object') return;

    const labels = [data.course?.course_name || "Unknown Course"];

    // Create datasets for each metric
    const completedStudentsDataset = {
      label: 'Completed Students',
      data: [data.completedStudents || 0],
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
    };

    const totalStudentsDataset = {
      label: 'Total Students',
      data: [data.totalStudents || 0],
      backgroundColor: 'rgba(255,99,132,1)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
    };
    const totalMaterial = {
      label: 'Total Materials',
      data: [data.totalMaterials || 0],
      backgroundColor: 'rgba(255,18,18,1)',
      borderColor: 'rgba(255,18,18,1)',
      borderWidth: 1,
    };


    const totalVideosWatchedDataset = {
      label: 'Average Videos Watched',
      data: [data.totalVideosWatched || 0],
      backgroundColor: 'rgba(255,206,86,1)',
      borderColor: 'rgba(255,206,86,1)',
      borderWidth: 1,
    };

    const totalAssessmentsCompletedDataset = {
      label: 'Total Assessments Completed',
      data: [data.totalAssessmentsCompleted || 0],
      backgroundColor: 'rgba(153,102,255,1)',
      borderColor: 'rgba(153,102,255,1)',
      borderWidth: 1,
    };

    // Set chart data with all datasets
    setChartData({
      labels,
      datasets: [
        totalStudentsDataset,
        completedStudentsDataset,
        totalMaterial,
        totalVideosWatchedDataset,
        totalAssessmentsCompletedDataset,
      ],
    });
  };
  // Handle course selection change
  const handleCourseChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCourseId(selectedId);
    fetchPerformance(selectedId);
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <SideBar current={"performance-analysis"} />
      <section id="content">
        <Navbar />
        <main>
          <div className="performance-container" style={{ marginTop: '70px' }}>
            <div style={{ marginBottom: '80px' }}>
              <h2 style={{ color: 'darkblue' }}>Select Course</h2>
              <select value={selectedCourseId} onChange={handleCourseChange}>
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.course_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No Courses Available</option>
                )}
              </select>

              <h2 style={{ color: 'darkblue', marginTop: '20px' }}>Performance  Analysis Chart</h2>
              <Bar data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default PerformanceAnalysis;