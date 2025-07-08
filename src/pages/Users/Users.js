import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Users.css';
import Spinner from '../../components/Spinner/Spinner';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(localStorage.getItem('usersSearch') || '');
  const [pageSize, setPageSize] = useState(Number(localStorage.getItem('usersPageSize')) || 3);
  const [page, setPage] = useState(Number(localStorage.getItem('usersPage')) || 1);
  const [openNameBox, setOpenNameBox] = useState(false);
  const [openEmailBox, setOpenEmailBox] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('usersSearch', search);
    localStorage.setItem('usersPageSize', pageSize);
    localStorage.setItem('usersPage', page);
  }, [search, pageSize, page]);

  const filtered = users
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.toLowerCase().includes(search.toLowerCase())
    )
    .filter(u =>
      (!selectedName || u.name === selectedName) &&
      (!selectedEmail || u.email === selectedEmail)
    );

  const total = filtered.length;
  const pages = Math.ceil(total / pageSize);
  const data = filtered.slice((page - 1) * pageSize, page * pageSize);
  const uniqueNames = [...new Set(users.map(u => u.name))];
  const uniqueEmails = [...new Set(users.map(u => u.email))];

  const handleApply = () => {
    setSelectedName(nameFilter);
    setSelectedEmail(emailFilter);
  };

  const handleReset = () => {
    setNameFilter('');
    setEmailFilter('');
    setSelectedName('');
    setSelectedEmail('');
    setOpenNameBox(false);
    setOpenEmailBox(false);
  };

  return (
    <div className="users">
      <div className="header-bar">
        <h2>Users</h2>
        <div className="search-container">
          <input
            placeholder="Search name, email, phone"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <span className="reset-icon" onClick={() => setSearch('')}>&times;</span>
          )}
        </div>
      </div>

      <div className="filter-bar">
        <label>Filter by:</label>

        <div className="combo-box">
          <div className="combo-label" onClick={() => {
            setOpenNameBox(!openNameBox);
            setOpenEmailBox(false);
          }}>Name</div>
          {openNameBox && (
            <div className="combo-dropdown">
              <input
                type="text"
                placeholder="Search name"
                value={nameFilter}
                onChange={e => setNameFilter(e.target.value)}
              />
              <div className="combo-options">
                {uniqueNames
                  .filter(n => n.toLowerCase().includes(nameFilter.toLowerCase()))
                  .map((name, i) => (
                    <div key={i} onClick={() => setNameFilter(name)}>{name}</div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="combo-box">
          <div className="combo-label" onClick={() => {
            setOpenEmailBox(!openEmailBox);
            setOpenNameBox(false);
          }}>Email</div>
          {openEmailBox && (
            <div className="combo-dropdown">
              <input
                type="text"
                placeholder="Search email"
                value={emailFilter}
                onChange={e => setEmailFilter(e.target.value)}
              />
              <div className="combo-options">
                {uniqueEmails
                  .filter(e => e.toLowerCase().includes(emailFilter.toLowerCase()))
                  .map((email, i) => (
                    <div key={i} onClick={() => setEmailFilter(email)}>{email}</div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <button onClick={handleApply}>Apply</button>
        <button onClick={handleReset}>Reset Filter</button>
      </div>

      {loading ? <Spinner /> : (
        <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th style={{ width: '200px' }}>Name</th>
              <th style={{ width: '250px' }}>Email</th>
              <th style={{ width: '200px' }}>Phone</th>
              <th style={{ width: '150px' }}>Website</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u, index) => (
              <tr key={u.id} onClick={() => navigate(`/users/${u.id}`)} style={{ cursor: 'pointer' }}>
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.website}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      <div className="pagination-controls">
        <div className="page-size">
          <label>Page Size:</label>
          <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}>
            <option>3</option>
            <option>5</option>
            <option>10</option>
          </select>
        </div>
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(1)}>Previous</button>
          {page > 1 && (
            <button onClick={() => setPage(page - 1)}>Back</button>
          )}
          <span>{page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Users;
