import React from 'react';
import { Route } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }: any) => {
  return <Route {...rest}>{children}</Route>;
};

export default PrivateRoute; 