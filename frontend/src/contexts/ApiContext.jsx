import React, { createContext, useContext } from 'react';
import axios from 'axios';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_DOMAIN}/api`,
    withCredentials: true,
  });

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);