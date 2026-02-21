import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import {useDebounce} from 'react-use'
import { Link } from 'react-router-dom';
import '../styles/home.css';
const Home = () => {
  const [projects, setProjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingprojects, setLoadingprojects] = useState(true);
  const [loadingteachers, setLoadingteachers] = useState(true);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [name, setName] = useState("");
  const [view, setView] = useState("projects"); 
  const [debouncedteacherfilter, setDebouncedteacherfilter] = useState("");



  // optimize
  useDebounce(()=>setDebouncedteacherfilter(teacherFilter),800,[teacherFilter]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setName(decoded.user.name || 'User');
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingprojects(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5200/logic/work/getprojects', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log("Fetched projects data:", data);
        if (Array.isArray(data)) setProjects(data);
        else setProjects([]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingprojects(false);
      }
    };
    fetchProjects();
  }, []);

  
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoadingteachers(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5200/logic/work/teachers', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        console.log("Fetched teachers data:", data);
        if (Array.isArray(data)) setTeachers(data);
        else setTeachers([]);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoadingteachers(false);
      }
    };
    fetchTeachers();
  }, []);
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };
  return (
    <div className='content'>
      <div className='sidebar'>
        <p>{name}</p>
        <button className='addpro' onClick={() => setView("projects")}>Show Projects</button>
        <button className='addpro' onClick={() => setView("teachers")}>Show Teachers</button>
        <button className='addpro'><Link to="/addproject" className='add' >add new project</Link></button>
        <button className='logout' onClick={handleLogout}>Logout</button>
      </div>

      <div>
      
        {view === "projects" && (
          <table>
            <thead>
              <tr>
                <th>title</th>
                <th>description</th>
                <th>domain</th>
                <th>teacherId</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {loadingprojects ? (
                <tr><td colSpan="5">Loading projects...</td></tr>
              ) : projects.length > 0 ? (
                projects.map(project => (
                  <tr key={project._id}>
                    <td>{project.title}</td>
                    <td>{project.description}</td>
                    <td>{project.domain}</td>
                    <td>{project.teacherId?.name || project.teacherId}</td>
                    <td>{project.status}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">No projects found</td></tr>
              )}
            </tbody>
          </table>
        )}

      
        {view === "teachers" && (
          <div>
          <input
           type="text"
           placeholder="Search by domain..."
           value={teacherFilter}
          onChange={(e) => setTeacherFilter(e.target.value)}
          style={{ marginBottom: "10px", padding: "5px", width: "200px" }}
         />

          
          <table>
            <thead>
              <tr>
                <th>Teacher ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>domain</th>
              </tr>
            </thead>
            <tbody>
              {loadingteachers ? (
                 <tr><td colSpan="4">Loading teachers...</td></tr>
                  )            : teachers.length > 0 ? (
                   teachers
              .filter(teacher => {
  if (!debouncedteacherfilter) return true;
  return teacher.domain
    ?.toLowerCase()
    .includes(debouncedteacherfilter.toLowerCase());
})
    .map(teacher => (
      <tr key={teacher._id}>
        <td>{teacher._id}</td>
        <td>{teacher.name}</td>
        <td>{teacher.email}</td>
        <td>{teacher.domain}</td> 
      </tr>
                ))
              ) : (
                <tr><td colSpan="3">No teachers found</td></tr>
              )}
            </tbody>
          </table>
           </div>
        )}
       
      </div>
    </div>
  );
};

export default Home;
