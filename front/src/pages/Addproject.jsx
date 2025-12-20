import React, { useState, useEffect } from 'react';
import '../styles/addproject.css';

const AddProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5200/logic/work/teachers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTeachers(data);
      } catch (err) {
        console.error('Error fetching teachers:', err);
      }
    };
    fetchTeachers();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    if (!title || !description || !domain || !teacherId) {
      setErrorMsg('All fields are required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5200/logic/work/addproject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          domain: domain.trim(),
          teacherId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Project added successfully');
        setTitle('');
        setDescription('');
        setDomain('');
        setTeacherId('');
        setErrorMsg('');
      } else {
        alert(data.msg || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="add-project-container">
      <div className="form-card">
        <h2>Add New Project</h2>
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Domain (e.g., Web Development, AI)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
         
          <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} 
              </option>
            ))}
          </select>
          <button type="submit">Add Project</button>
        </form>
        {errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};

export default AddProject;
