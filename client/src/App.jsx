import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Nav/Navbar";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Compose from "./components/Compose/Compose";
import Inbox from "./components/Inbox/Inbox";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex justify-center pt-24">
        <div className="pixel-loader">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/compose" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/compose" /> : <Signup />} />
        <Route
          path="/compose"
          element={
            <ProtectedRoute>
              <Compose />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? "/compose" : "/login"} />} />
      </Routes>
    </div>
  );
}
