import React, { createContext, useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

// User Context
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = (username, role) => setUser({ username, role });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

// Login Page
const Login = () => {
  const { login } = useAuth();
  const handleLogin = (role) => login("User", role);
  
  return (
    <div>
      <h2>Login</h2>
      <button onClick={() => handleLogin("Admin")}>Login as Admin</button>
      <button onClick={() => handleLogin("Editor")}>Login as Editor</button>
      <button onClick={() => handleLogin("Viewer")}>Login as Viewer</button>
    </div>
  );
};

// Navbar
const Navbar = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <nav>
      <span>{user.username} ({user.role})</span>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/profile">Profile</Link>
      {user.role === "Admin" && <Link to="/settings">Settings</Link>}
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

// Dashboard
const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2>Dashboard</h2>
      {user.role === "Admin" && <p>Admin Controls</p>}
      {user.role === "Editor" && <p>Content Editor Panel</p>}
      {user.role === "Viewer" && <p>Read-Only Reports</p>}
    </div>
  );
};

// Profile
const Profile = () => <h2>Profile Page</h2>;

// Settings
const Settings = () => <h2>Settings Page (Admin Only)</h2>;

// App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={["Admin"]}><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
