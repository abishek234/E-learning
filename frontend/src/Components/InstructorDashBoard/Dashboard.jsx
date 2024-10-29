import React, { useState, useEffect } from 'react';
import './dstyle.css';
import SideBar from './SideBar';
import Navbar from './Navbar';
import axios from 'axios'; // Import Axios

function Dashboard() {
  const [coursesCount, setCoursesCount] = useState(0);
  const id = localStorage.getItem('id');

  useEffect(() => {
    if (id) {
      const fetchCoursesCount = async () => {
        try {
          const response = await axios.get(`http://localhost:7000/api/courses/instructor/count/${id}`);
          console.log(response.data); // Log to check response structure
          setCoursesCount(response.data.count); // Set coursesCount to the count value
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchCoursesCount();
    } else {
      console.error('Instructor ID not found in local storage.');
    }
  }, [id]);

  return (
    <div style={{ backgroundColor: "#eee" }}>
      <SideBar current={"dashboard"} />
      <section id="content">
        <Navbar />
        <main>
          <div className="head-title">
            <div className="left">
              <h1 id="dashboard" style={{ color: 'darkblue' }}>Instructor Dashboard</h1>
            </div>
          </div>
          <ul className="box-info">
            <li>
              <i className='bx bx-book' id="i"></i>
              <span className="text">
                <h3>{coursesCount}</h3> {/* Display the count directly */}
                <p>Total Assigned Courses</p>
              </span>
            </li>
          </ul>
        </main>
      </section>
    </div>
  );
}

export default Dashboard;