import { useState, createContext, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(false);

  const signIn = (email) => {
    setUserEmail(email);
  };

  const signOut = () => {
    setUserEmail(false);
  };

  return (
    <AuthContext.Provider value={{ userEmail, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};