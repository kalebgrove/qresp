import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function Questions() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = Cookies.get('user'); // Read user cookie
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the user data
    }
  }, []);

  return (
    <div>
      {user ? (
        <h1>Welcome, {user.email}</h1>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default Questions;
