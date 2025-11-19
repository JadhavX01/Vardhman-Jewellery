// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load token from localStorage when app starts
//   useEffect(() => {
//     const storedUser = localStorage.getItem("vardhaman_user");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (err) {
//         console.error("Error parsing stored user:", err);
//         localStorage.removeItem("vardhaman_user");
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Save user in localStorage when logged in
//   const login = (userData) => {
//     localStorage.setItem("vardhaman_user", JSON.stringify(userData));
//     setUser(userData);
//   };

//   // Logout — clear user + localStorage
//   const logout = () => {
//     localStorage.removeItem("vardhaman_user");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // custom hook for easy access
// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app start, try to restore session and refresh profile
  useEffect(() => {
    const storedUserRaw = localStorage.getItem("vardhaman_user");

    if (!storedUserRaw) {
      setLoading(false);
      return;
    }

    let storedUser;
    try {
      storedUser = JSON.parse(storedUserRaw);
    } catch (err) {
      console.error("Error parsing stored user:", err);
      localStorage.removeItem("vardhaman_user");
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(storedUser);

    if (!storedUser?.token) {
      setLoading(false);
      return;
    }

    API.get("/auth/me")
      .then((res) => {
        if (res.data && res.data.user) {
          const syncedUser = { ...res.data.user, token: storedUser.token };
          setUser(syncedUser);
          localStorage.setItem("vardhaman_user", JSON.stringify(syncedUser));
        }
      })
      .catch(() => {
        localStorage.removeItem("vardhaman_user");
        localStorage.removeItem("token");
        localStorage.removeItem("custId");
        localStorage.removeItem("role");
        setUser(null);
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const login = (userData) => {
    localStorage.setItem("vardhaman_user", JSON.stringify(userData));
    if (userData?.token) {
      localStorage.setItem("token", userData.token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("vardhaman_user");
    localStorage.removeItem("custId");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
