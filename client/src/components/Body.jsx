import React, { useContext } from 'react';
import { AppContent } from '../context/AppContext';

const Body = () => {
  const { userData, isLoggedIn } = useContext(AppContent);

  return (
    <>
      {isLoggedIn && userData && userData.name && (
        <div className="flex flex-col items-center mt-10 px-4 text-center">
          <ul className="list-disc list-inside text-left text-gray-900 mb-4">
            <li>JWT-based authentication with HTTP-only cookies</li>
            <li>Email verification and password reset via OTP</li>
            <li>Responsive UI with React and Tailwind CSS</li>
            <li>Secure backend with Express and MongoDB</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Body;