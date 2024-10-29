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
        
        <Link to={"/instructordashboard"} className="brand a">
          <img src={img1} alt=""/>
          <span className="text" id="admin"> Instructor</span>
          </Link>
          
          <ul className="side-menu">
          <li className={current ==="dashboard" ? 'active' : ''} >
            <Link to={"/instructordashboard"} className="a">
              <i className='bx bxs-dashboard' id="i"></i>
              <span className="text">Dashboard</span>
            </Link>
          </li>
        
          <li className={current ==="courses" ? 'active' : ''}>
          <Link to={"/instructorcourses"} className="a">
              <i className='bx bxs-book' id="i"></i>
              <span className="text">Courses</span>
            </Link>
          </li >

          <li className={current ==="question" ? 'active' : ''}>
          <Link to={"/QuestionsTable"} className="a">
              <i className='bx bx-question-mark' id="i"></i>
              <span className="text">Questions</span>
            </Link>
          </li >
           <li className={current ==="material" ? 'active' : ''}>
            <Link to={"/MaterialsTable"} className="a">
            <i class='bx bxs-file-pdf'></i>
            <span className="text">Materials</span>
            </Link>
          </li>
          <li className={current ==="performance" ? 'active' : ''}>
            <Link to={"/StudentPerformance"} className="a">
            <i class='bx bxs-file-pdf'></i>
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