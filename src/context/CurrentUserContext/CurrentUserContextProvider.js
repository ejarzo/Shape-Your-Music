import React, { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import netlifyIdentity from 'netlify-identity-widget';

netlifyIdentity.init({
  namePlaceholder: 'Username',
});

export const CurrentUserContext = React.createContext({});

function CurrentUserContextProvider({ children }) {
  const [user, setUser] = useState(netlifyIdentity.currentUser());
  const client = useApolloClient();

  useEffect(() => {
    netlifyIdentity.on('login', user => {
      setUser(user);
    });
    netlifyIdentity.on('logout', () => {
      client.clearStore();
      setUser(null);
    });
  });

  const authenticate = ({ showSignup = false, onSuccess } = {}) => {
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
