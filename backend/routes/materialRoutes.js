const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// Route definitions
router.get('/:courseId', materialController.getAllMaterialsForCourse );
router.post('/add-material', materialController.addMaterial);
router.put('/update/:id', materialController.updateMaterial);
router.delete('/:id', materialController.deleteMaterial);
router.get('/material/:courseId', materialController.getMaterialsByCourse);
router.get('/',materialController.getAllMaterials)

module.exports = router;

