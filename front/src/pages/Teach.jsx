import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../styles/teach.css';
const Teach = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setName(decoded.user?.name || 'User');
      } catch (err) {
        console.error("Failed to decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5200/logic/work/teachersget', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      console.log("Fetched projects data:", data);
      if (Array.isArray(data)) setProjects(data);
      else setProjects([]);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  
  const handleAccept = async (projectId) => {
    await updateProjectStatus(projectId, 'accepted');
  };

  
  const handleRefuse = async (projectId) => {
    await updateProjectStatus(projectId, 'refused');
  };

  
  const updateProjectStatus = async (projectId, status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5200/logic/work/decide', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectId, status })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.msg); 
        fetchProjects(); 
      } else {
        alert(data.msg || 'Failed to update project');
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert('Error updating project status');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div className='teach-container'>
      <aside className="sidebar">
    <h2 className="teacher-name"> {name}</h2>
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
     </aside>

    <main className="content">
      <table className="projects-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Domain</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project._id}>
                <td>{project.title}</td>
                <td>{project.description}</td>
                <td>{project.domain}</td>
                <td>
                  <span style={{
                    color: project.status === 'accepted' ? 'green' : 
                           project.status === 'refused' ? 'red' : 'orange'
                  }}>
                    {project.status}
                  </span>
                </td>
                <td>
                 
                  {project.status === 'pending' ? (
                    <>
                      <button 
                        onClick={() => handleAccept(project._id)}
                        disabled={loading}
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          marginRight: '10px',
                          padding: '5px 15px',
                          border: 'none',
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleRefuse(project._id)}
                        disabled={loading}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          padding: '5px 15px',
                          border: 'none',
                          cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Refuse
                      </button>
                    </>
                  ) : (
                    <span>No action needed</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No projects found</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
      
    </div>
  );
};

export default Teach;