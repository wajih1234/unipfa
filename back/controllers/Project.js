const Project = require('../models/Project');
const User = require('../models/User');
const mongoose = require('mongoose');
// student add the new project
exports.Project = async (req, res) => {
     const { title, description, domain, teacherId } = req.body;

  try {
    // Check user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized: user not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Validate inputs
    if (!title || !description || !domain || !teacherId) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(req.user.id) || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ msg: 'Invalid userId or teacherId' });
    }

    // Check duplicate project
    const existingProject = await Project.findOne({ title });
    if (existingProject) return res.status(400).json({ msg: 'Project already exists' });

    const project = new Project({
      studentId: new mongoose.Types.ObjectId(req.user.id), 
      title: title.trim(),
      description: description.trim(),
      domain: domain.trim(),
      teacherId: new  mongoose.Types.ObjectId(teacherId),
      status: 'pending'
    });

    await project.save();

    res.status(201).json({ msg: 'Project request created', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
// teacher accept or refuse the project
exports.updatepro = async(req, res) => {
  const { projectId, status } = req.body;

  try {
    
    if (!projectId || !status) {
      return res.status(400).json({ msg: 'projectId and status are required' });
    }

    
    if (!['accepted', 'refused', 'pending'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    project.status = status;
    await project.save(); 
    
    res.json({ msg: `Project updated to status: ${status}` });

  } catch(err) {
    console.error(err); 
    res.status(500).json({ msg: err.message }); 
  }
};
 // students see all his projects
exports.getprojects= async (req, res) => {
  try {
    const projects = await Project.find({ studentId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server error');
  }
};
