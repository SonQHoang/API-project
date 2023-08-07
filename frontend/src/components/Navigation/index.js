import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="navigation-container">
      <div className="logo-container">
        <Link to="/">
          <img src="https://res.cloudinary.com/dgxpqnbwn/image/upload/v1691392577/Guitar_BnB_fw7zb0.png"
            alt="Logo" className="logo-img" />
        </Link>
      </div>

      <ul className="nav-links">
        {isLoaded && sessionUser && (
          <>
          <li>
            <Link to="/spots/new" className='create-spot-button'>
            Create a New Spot
            </Link>
          </li>
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          </>
        )}

        {isLoaded && !sessionUser && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
}


export default Navigation;