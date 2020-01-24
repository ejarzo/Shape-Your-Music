import React, { useState, useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

netlifyIdentity.init({
  namePlaceholder: 'Username',
});

export const CurrentUserContext = React.createContext({});

function CurrentUserContextProvider({ children }) {
  const [user, setUser] = useState(netlifyIdentity.currentUser());
  useEffect(() => {
    netlifyIdentity.on('login', user => {
      setUser(user);
    });
    netlifyIdentity.on('logout', () => {
      setUser(null);
    });
  });

  const authenticate = ({ showSignup = false, onSuccess }) => {
    netlifyIdentity.open(showSignup && 'signup');
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  const currentUser = {
    user,
    isAuthenticated: !!user,
    authenticate: authenticate,
    logout: logout,
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export default CurrentUserContextProvider;
