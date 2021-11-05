import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const auth = authService;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [auth]);
  const refreshUser = () => {
    setUserObj({
      uid: authService.currentUser.uid,
      displayName: authService.currentUser.displayName,
    });
  };
  return (
    <div>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        'Intializing...'
      )}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </div>
  );
}

export default App;
