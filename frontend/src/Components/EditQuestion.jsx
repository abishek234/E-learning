import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditQuestion(){
    const navigate = useNavigate();
    const location = useLocation();
    const questionId = location.pathname.split("/")[2];

    const [formData, setFormData] = useState({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchQuestion() {
            try {
                const response = await axios.get(`http://localhost:7000/api/questions/question/${questionId}`);
                setFormData(response.data);
            } catch (err) {
                setError('Error fetching question data');
            }
        }
        fetchQuestion();
    }, [questionId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://localhost:7000/api/questions/${questionId}`, formData);
            if (response.status === 200) {
                toast.success('Question updated successfully', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                });
                navigate("/QuestionsTable"); // Navigate back to questions list
            }
        } catch (err) {
            setError('Failed to update question');
            console.error(err);
        }
    };

    return(
        <div className='add'>
        <div className="container1">
            <h1>Edit Question</h1>
            <form onSubmit={handleSubmit} className="addQuestion-form">
                <div className="form-group">
                    <label>Question</label>
                    <input type="text" name="question" value={formData.question} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                    <label>Option 1</label>
                    <input type="text" name="option1" value={formData.option1} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                    <label>Option 2</label>
                    <input type="text" name="option2" value={formData.option2} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                    <label>Option 3</label>
                    <input type="text" name="option3" value={formData.option3} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                    <label>Option 4</label>
                    <input type="text" name="option4" value={formData.option4} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                    <label>Correct Option</label>
                    <input type="text" name="answer" value={formData.answer} onChange={handleChange} className="form-control" required />
                </div>
                <div className='btn1'>
                <button type="submit">Update Question</button>
                <button type="submit" onClick={() => navigate("/QuestionsTable")} style={{ marginLeft: '10px' }}>Back</button>
                </div>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>}
        </div>
        </div>
    )
}

export default EditQuestion;