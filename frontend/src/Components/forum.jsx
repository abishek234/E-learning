import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './css/forum.css'; // Ensure to include your CSS file
import { useLocation } from 'react-router-dom';

function Forum() {
  const taskRef = useRef("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState(localStorage.getItem("name"));
  const [course, setCourse] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const courseId = location.pathname.split("/")[2];

  const [formData, setFormData] = useState({
    name: name,
    course_id: courseId,
    content: ''
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/discussions/${courseId}`);
        setMessages(response.data);
        analyzeSentiment(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    const fetchSuggestions = async () => {
      // Placeholder for AI suggestions
      const aiSuggestions = [
        "Consider reviewing the video on advanced topics.",
        "Check out additional resources in the course materials.",
        "Ask questions about specific concepts you find challenging."
      ];
      setSuggestions(aiSuggestions);
    };

    fetchMessages();
    fetchCourse();
    fetchSuggestions();
  }, [courseId]);

  const analyzeSentiment = (messages) => {
    // Example sentiment analysis placeholder
    // This can be replaced with a real sentiment analysis API
    const positiveKeywords = ['great', 'helpful', 'understand', 'good', 'excellent'];
    const negativeKeywords = ['bad', 'difficult', 'confusing', 'poor', 'hate'];
    
    let positiveCount = 0;
    let negativeCount = 0;

    messages.forEach(message => {
      positiveKeywords.forEach(keyword => {
        if (message.content.toLowerCase().includes(keyword)) {
          positiveCount++;
        }
      });
      negativeKeywords.forEach(keyword => {
        if (message.content.toLowerCase().includes(keyword)) {
          negativeCount++;
        }
      });
    });

    console.log(`Positive Count: ${positiveCount}, Negative Count: ${negativeCount}`);
    // You can display these counts or provide feedback based on them
  };

  const addTask = async () => {
    if (taskRef.current && taskRef.current.value.trim() !== "") {
      const newMessage = taskRef.current.value.trim();
      const userId = localStorage.getItem("id");

      const discussionData = {
        name: name,
        course_id: courseId,
        content: newMessage,
        uName: userId
      };

      try {
        await axios.post('http://localhost:7000/api/discussions/addMessage', discussionData);
        setFormData({ ...formData, content: '' });
        setMessages([...messages, { uName: name, content: newMessage }]);
      } catch (error) {
        console.error("Error adding message:", error);
      }
    } else {
      alert("Enter a Message");
    }
  };

  return (
    <>
    <br />
      <h2 className="forum-title">Discussion Forum for {course?.course_name}</h2>
      <div className="forum-container">
        <div className='inputContainer'>
          <textarea
            cols='30'
            rows='5'
            type='text'
            ref={taskRef}
            name="taskInput"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="forum-textarea"
            placeholder="Type your message here..."
          />
        </div>
        <div className='snd'>
          <button onClick={addTask} className="send-button">Send</button>
        </div>
        
        {messages.length > 0 && (
          <div className='taskContainer'>
            {messages.map((value, key) => {  
              if (value.content.trim() !== "") {
                return (
                  <div className='taskItem' key={key}>
                    <p className="message-content">
                      <span className="user-name">{value.uName}</span>
                      {value.content}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      {/* AI Suggestions Section */}
      {/* <div className="ai-suggestions">
        <h3>AI Suggestions</h3>
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div> */}

      {/* Analytics Section */}
      <div className="analytics">
        <h3>Participation Analytics</h3>
        <p>Total Messages Posted: {messages.length}</p>
        {/* Add more analytics data here */}
      </div>
    </>
  );
}

export default Forum;
