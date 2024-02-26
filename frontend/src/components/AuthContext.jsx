import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    console.log("AuthProvider userEmail state:", userEmail);
  }, [userEmail]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);

        try {
          const response = await fetch(`http://localhost:5000/getUsername?email=${encodeURIComponent(user.email)}`);
          if (response.ok) {
            const data = await response.json();
            setUsername(data.message);
          } else {
            console.log("Failed to fetch username");
          }
        } catch (error) {
          console.error("Error fetching username", error);
        }
      } else {
        setUserEmail(null);
        setUsername(null);
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
    <AuthContext.Provider value={{ userEmail, username, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};