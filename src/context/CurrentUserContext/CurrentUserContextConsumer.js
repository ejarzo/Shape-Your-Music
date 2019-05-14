import React from 'react';
import { CurrentUserContext } from './CurrentUserContextProvider';

function CurrentUserContextConsumer(props) {
  const { children } = props;
  return <CurrentUserContext.Consumer>{children}</CurrentUserContext.Consumer>;
}

export default CurrentUserContextConsumer;
