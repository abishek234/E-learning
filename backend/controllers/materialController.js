const Material = require('../models/Material');
const Course = require('../models/Course');

// Add Material for a course
exports.addMaterial = async (req, res) => {
    const { id, title, description, y_link } = req.body;

    try {

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const material = new Material({
            title,
            description,
            y_link,
            course: id,
        });

        const savedMaterial = await material.save();
        console.log(savedMaterial);
        course.Material.push(savedMaterial._id);
        await course.save();
        return res.status(201).json(savedMaterial);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all materials for a specific course
exports.getAllMaterialsForCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const materials = await Material.find({ course: courseId });
        return res.status(200).json(materials);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get all materials across all courses
exports.getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.find().populate('course', 'course_name'); // Populate course name
        return res.status(200).json(materials);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete a material
exports.deleteMaterial = async (req, res) => {
    const { materialId } = req.params;

    try {
        const material = await Material.findById(materialId);

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        await material.remove();
        return res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update a material
exports.updateMaterial = async (req, res) => {
    const { id } = req.params;
    
    const { title, description, y_link } = req.body;

    try {
        const material = await Material.findById(id);

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        material.title = title;
        material.description = description;
        material.y_link = y_link;

        await material.save();
        return res.json(material);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get material by ID
exports.getMaterialById = async (req, res) => {
    const { materialId } = req.params;

    try {
        const material = await Material.findById(materialId);

        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        return res.json(material);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get materials by course ID
exports.getMaterialsByCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const materials = await Material.find({ course: courseId });
        return res.json(materials);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


