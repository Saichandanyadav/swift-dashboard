import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserDetails.css';

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(res => setUser(res.data));
  }, [id]);

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="user-details-page">
      <div className="user-details-header">
        <button onClick={() => navigate(-1)} className="back-button">&larr;</button>
        <span>Welcome, {user.name}!</span>
      </div>

      <div className="user-card">
        <div className="user-header">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <h3>{user.name}</h3>
            <span>{user.email}</span>
          </div>
        </div>

        <div className="user-details-form">
          <div className="form-row">
            <div>
              <label>Name</label>
              <input type="text" value={user.name} disabled />
            </div>
            <div>
              <label>Username</label>
              <input type="text" value={user.username} disabled />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Email</label>
              <input type="text" value={user.email} disabled />
            </div>
            <div>
              <label>Phone</label>
              <input type="text" value={user.phone} disabled />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Website</label>
              <input type="text" value={user.website} disabled />
            </div>
            <div>
              <label>Company</label>
              <input type="text" value={user.company.name} disabled />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Catch Phrase</label>
              <input type="text" value={user.company.catchPhrase} disabled />
            </div>
            <div>
              <label>BS</label>
              <input type="text" value={user.company.bs} disabled />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Address</label>
              <input
                type="text"
                value={`${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`}
                disabled
              />
            </div>
            <div>
              <label>Geo Location</label>
              <input
                type="text"
                value={`Lat: ${user.address.geo.lat}, Lng: ${user.address.geo.lng}`}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
