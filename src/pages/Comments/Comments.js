import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Comments.css';
import Spinner from '../../components/Spinner/Spinner';

function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(localStorage.getItem('commentsSearch') || '');
  const [sortKey, setSortKey] = useState(localStorage.getItem('commentsSortKey') || '');
  const [setSortValue] = useState('');
  const [pageSize, setPageSize] = useState(Number(localStorage.getItem('commentsPageSize')) || 10);
  const [page, setPage] = useState(Number(localStorage.getItem('commentsPage')) || 1);

  const [openNameBox, setOpenNameBox] = useState(false);
  const [openEmailBox, setOpenEmailBox] = useState(false);
  const [openPostIdBox, setOpenPostIdBox] = useState(false);

  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [postIdFilter, setPostIdFilter] = useState('');

  const [selectedName, setSelectedName] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedPostId, setSelectedPostId] = useState('');

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/comments')
      .then(res => {
        setComments(res.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('commentsSearch', search);
    localStorage.setItem('commentsSortKey', sortKey);
    localStorage.setItem('commentsPageSize', pageSize);
    localStorage.setItem('commentsPage', page);
  }, [search, sortKey, pageSize, page]);

  const filtered = comments
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.body.toLowerCase().includes(search.toLowerCase())
    )
    .filter(c =>
      (!selectedName || c.name === selectedName) &&
      (!selectedEmail || c.email === selectedEmail) &&
      (!selectedPostId || c.postId.toString() === selectedPostId)
    );

  const total = filtered.length;
  const pages = Math.ceil(total / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const sortedPageData = [...pageData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey].toString().toLowerCase();
    const bVal = b[sortKey].toString().toLowerCase();
    return aVal > bVal ? 1 : -1;
  });

  const uniqueNames = [...new Set(comments.map(c => c.name))];
  const uniqueEmails = [...new Set(comments.map(c => c.email))];
  const uniquePostIds = [...new Set(comments.map(c => c.postId.toString()))];

  const handleApply = () => {
    setSelectedName(nameFilter);
    setSelectedEmail(emailFilter);
    setSelectedPostId(postIdFilter);

    if (nameFilter) {
      setSortKey('name');
      setSortValue(nameFilter);
    } else if (emailFilter) {
      setSortKey('email');
      setSortValue(emailFilter);
    } else if (postIdFilter) {
      setSortKey('postId');
      setSortValue(postIdFilter);
    } else {
      setSortKey('');
      setSortValue('');
    }
  };

  const handleReset = () => {
    setNameFilter('');
    setEmailFilter('');
    setPostIdFilter('');
    setSelectedName('');
    setSelectedEmail('');
    setSelectedPostId('');
    setSortKey('');
    setSortValue('');
    setOpenNameBox(false);
    setOpenEmailBox(false);
    setOpenPostIdBox(false);
  };

  return (
    <div className="comments">
      <div className="header-bar">
        <h2>Comments</h2>
        <div className="search-container">
          <input
            placeholder="Search name, email, body"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          {search && <span className="reset-icon" onClick={() => setSearch('')}>&times;</span>}
        </div>
      </div>

      <div className="filter-bar">
        <label>Sort by:</label>

        <div className="combo-box">
          <div className="combo-label" onClick={() => {
            setOpenNameBox(!openNameBox);
            setOpenEmailBox(false);
            setOpenPostIdBox(false);
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
            setOpenPostIdBox(false);
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

        <div className="combo-box">
          <div className="combo-label" onClick={() => {
            setOpenPostIdBox(!openPostIdBox);
            setOpenNameBox(false);
            setOpenEmailBox(false);
          }}>Post ID</div>
          {openPostIdBox && (
            <div className="combo-dropdown">
              <input
                type="text"
                placeholder="Search post ID"
                value={postIdFilter}
                onChange={e => setPostIdFilter(e.target.value)}
              />
              <div className="combo-options">
                {uniquePostIds
                  .filter(id => id.toLowerCase().includes(postIdFilter.toLowerCase()))
                  .map((id, i) => (
                    <div key={i} onClick={() => setPostIdFilter(id)}>{id}</div>
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
              <th style={{ width: '100px' }}>Post ID</th>
              <th style={{ width: '250px' }}>Name</th>
              <th style={{ width: '250px' }}>Email</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {sortedPageData.map((c, index) => (
              <tr key={c.id}>
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{c.postId}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.body}</td>
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
            <option>10</option>
            <option>30</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(1)}>Previous</button>
          {page > 1 && <button onClick={() => setPage(page - 1)}>Back</button>}
          <span>{page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Comments;
