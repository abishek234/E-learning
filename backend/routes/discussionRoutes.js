const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');

// Route definitions
router.get('/:courseId', discussionController.getDiscussionsByCourse);
router.post('/addMessage', discussionController.createDiscussion);

module.exports = router;