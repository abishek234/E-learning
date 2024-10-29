import React from "react";
import { Link } from "react-router-dom";
import img1 from "../images/user.png"
import { useNavigate } from "react-router-dom";

function SideBar(props){
    const { current } = props;

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
      }
    return(
        <div id="sidebar">
        
        <Link to={"/dashboard"} className="brand a">
          <img src={img1} alt=""/>
          <span className="text" id="admin"> Admin</span>
          </Link>
          
          <ul className="side-menu">
          <li className={current ==="dashboard" ? 'active' : ''} >
            <Link to={"/dashboard"} className="a">
              <i className='bx bxs-dashboard' id="i"></i>
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li  className={current ==="user" ? 'active' : ''}>
          <Link to={"/Dusers"} className="a">
              <i className='bx bxs-group' id="i"></i>
              <span className="text">Users</span>
            </Link>
          </li>
          <li className={current ==="courses" ? 'active' : ''}>
          <Link to={"/DCourses"} className="a">
              <i className='bx bxs-book' id="i"></i>
              <span className="text">Courses</span>
            </Link>
          </li >
          <li className={current ==="addtutors" ? 'active' : ''}>
          <Link to={"/AddTutors"} className="a">
              <i className='bx bxs-user-plus' id="i"></i>
              <span className="text">Add Tutors</span>
            </Link>
          </li>
          <li className={current ==="tutor" ? 'active' : ''}>
          <Link to={"/Dtutors"} className="a">
              <i className='bx bxs-user-detail' id="i"></i>
              <span className="text">Tutors</span>
            </Link>
          </li>
          <li className={current ==="performance-analysis" ? 'active' : ''}>
          <Link to={"/PerformanceAnalysis"} className="a">
              
              <i class='bx bx-analyse' id="i"></i>
              <span className="text">Performance</span>
            </Link>
          </li>

          <li >
          <Link className="a" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
    <i className='bx bx-log-out' id="i"></i>
    <span className="text">Logout</span>
</Link>
          </li>
        </ul>
      </div>
    );
}

export default SideBar