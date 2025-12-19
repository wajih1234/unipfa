const Project = require('../models/Project');
const User = require('../models/User');

// student add the new project
exports.Project = async (req, res) => {
  const { title,description,domain,teacherId } = req.body;
  try {
      const user = await User.findById(req.user.id);
      if(!user)  return res.status(404).json({msg:'User not found'});
     if (!title || !description || !domain ) {return res.status(400).json({ msg: 'All fields are required' });}
      let project1 = await Project.findOne({ title });
      if (project1) return res.status(400).json({ msg: 'this project is already inserted' });
       const project= new Project({  studentId: req.user.id,title, description, domain, teacherId,
      status: 'pending'});
       await project.save();
      res.status(201).json({ msg: 'Project request created', project });
  } catch (err) {
    res.status(500).send('Server error');
  }
};
// teacher accept or refuse the project
exports.updatepro= async(req,res) =>
    {
      const { projectId, status } = req.body;

      try{
        const project =  await  Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: 'there is no project ' });
        project.status=status;
         project.save();
          res.json({ msg: `project updated to status: ${status}` });

        

           
      } catch(err){
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
