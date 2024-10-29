import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { faBackward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Modal } from 'antd';
import axios from "axios";

function YourComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.pathname.split("/")[2];
  const [test, setTest] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("id"));
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [correctCount, setCorrectCount] = useState(0); 
  const [openModal, setOpenModal] = useState(false);
  const [totalQsns, setTotalQsns] = useState(0);
  const [timeLimit, setTimeLimit] = useState(300); // Set time limit in seconds
  const [timerActive, setTimerActive] = useState(false);
  
  // Track tab switches
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // Warn on tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => prev + 1);
        if (tabSwitchCount < 2) {
          alert(`Warning: You have switched tabs ${tabSwitchCount + 1} time(s).`);
        } else if (tabSwitchCount === 2) {
          alert("You have switched tabs too many times. The test will now close.");
          handleSubmit(); // Automatically submit when limit is reached
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tabSwitchCount]);

  // Start timer on component mount
  useEffect(() => {
    if (timerActive) {
      const timer = setInterval(() => {
        setTimeLimit(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(); // Automatically submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerActive]);

  // Fetch questions
  useEffect(() => {
    fetch(`http://localhost:7000/api/questions/${courseId}`)
      .then(res => res.json())
      .then(res => {
        setTest(res);
        setTotalQsns(res.length);
        setSelectedAnswers(new Array(res.length).fill(false));
        setTimerActive(true); // Start the timer when questions are fetched
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [courseId]);

  const handleRadioChange = (questionIndex, selectedOption) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    const qsn = test[questionIndex];
    if (qsn.answer === selectedOption) {
      setCorrectCount(correctCount + 1);
      updatedSelectedAnswers[questionIndex] = true;
    } else if (updatedSelectedAnswers[questionIndex] === true) {
      setCorrectCount(correctCount - 1);
      updatedSelectedAnswers[questionIndex] = false;
    }
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handleSubmit = () => {
    const data = {
      courseId: courseId,
      userId: localStorage.getItem("id"),
      marks: (correctCount / totalQsns) * 100 
    };
    
    axios.post(`http://localhost:7000/api/assessments/add/${userId}/${courseId}`, data)
      .then(response => {
        console.log('Request successful:', response.data);
        setOpenModal(true); // Open modal on successful submission
      })
      .catch(error => {
        console.error('Error:', error);
      });
    
    // Stop timer when submitted
    setTimerActive(false);
  };

   // Modal handling
   const showModal = () => {
     setOpenModal(true);
   };

   const handleOk = () => {
     setOpenModal(false);
     navigate(`/course/${courseId}`); // Navigate back after closing modal
   };

   const handleCancel = () => {
     setOpenModal(false);
   };

   let message = '';
  
   if (correctCount === totalQsns) {
     message = 'Awesome 😎';
   } else if (correctCount >= totalQsns / 2) {
     message = 'Good 😊';
   } else {
     message = 'Poor 😒';
   }

   return (
     <div className="assessment-container">
       <div style={{ display: 'flex' }}>
         <button type="submit" id="backbtn" className="submit-button" onClick={() => navigate(`/course/${courseId}`)}>
           <FontAwesomeIcon icon={faBackward} />
         </button>  
         <h1 className="assessment-title" style={{ backgroundColor: 'darkblue', marginLeft: '440px', width: '26%', color: "white", borderRadius: "25px", marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           Assessment Questions
         </h1>
       </div>
       
       <div className="assessment-form">
         {test.map((question, index) => (
           <div key={question.no} style={{ padding: "10px", backgroundColor: "rgb(454, 225, 180)", marginTop: "10px", borderRadius: "18px" }}>
             <h3>{"" + question.question}</h3>
             <label className="option">
               <input
                 type="checkbox"
                 name={`question_${question.no}`}
                 value={question.option1}
                 onChange={() => handleRadioChange(index, question.option1)}
                 style={{ marginLeft: "20px" }}
                 required
               /> {question.option1}
             </label>
             <label className="option">
               <input
                 type="checkbox"
                 name={`question_${question.no}`}
                 value={question.option2}
                 onChange={() => handleRadioChange(index, question.option2)}
                 style={{ marginLeft: "20px" }}
               /> {question.option2}
             </label>
             <label className="option">
               <input
                 type="checkbox"
                 name={`question_${question.no}`}
                 value={question.option3}
                 onChange={() => handleRadioChange(index, question.option3)}
                 style={{ marginLeft: "20px" }}
               /> {question.option3}
             </label>
             <label className="option">
               <input
                 type="checkbox"
                 name={`question_${question.no}`}
                 value={question.option4}
                 onChange={() => handleRadioChange(index, question.option4)}
                 style={{ marginLeft: "20px" }}
               /> {question.option4}
             </label>
           </div>
         ))}
         
         {/* Timer Display */}
         <h4>Time Remaining: {Math.floor(timeLimit / 60)}:{timeLimit % 60}</h4>

         <div style={{ padding: '20px' }}>
           <button onClick={() => navigate(0)} className="submit-button" style={{ marginLeft: "30px", padding: "5px 15px" }}>Reset</button>
           <button onClick={() => { handleSubmit(); }} className="submit-button11">Submit</button>
         </div>
       </div>

       {/* Modal for Results */}
       <Modal
         id="popup"
         open={openModal}
         onOk={handleOk}
         onCancel={handleCancel}
         style={{ padding: "10px" }}
       >
         <h2 style={{ color:'darkblue' }}>Assessment Result</h2>
         <h1 style={{ textAlign:"center" }}>{message}</h1>
         <h3 style={{ display:'flex', justifyContent:'center' }}>You scored {(correctCount / totalQsns) * 100} %</h3>
       </Modal>
     </div>
   );
}

export default YourComponent;