import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(false);

  useEffect(() => {
    console.log("AuthProvider userEmail state:", userEmail);
  }, [userEmail]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  const signOut = () => {
    auth.signOut().then(() => {
      setUserEmail(null); 
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  return (
    <AuthContext.Provider value={{ userEmail, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};