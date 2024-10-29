const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require('./routes/progressRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const learningRoutes = require('./routes/learningRoutes');
const questionRoutes = require('./routes/questionRoutes');
const materialRoutes = require('./routes/materialRoutes');


const app = express();


app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/questions',questionRoutes);
app.use('/api/materials',materialRoutes);



// Database Connection with MongoDB
mongoose.connect(process.env.MONGODB_URI, )
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));




app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));