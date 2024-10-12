import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebase';
import './index.css';
import './App.css';
import Graph from './pages/Graph';
import SignUpOrSignIn from './pages/SignUpOrSignIn';
import GraphList from './pages/GraphList';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <Router>
      <div className="header">
        {user && (
          <>
            <p className="user-email">Logged in as: {user.email}</p>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
      <Routes>
        <Route path="/graphlist" element={<ProtectedRoute element={GraphList} />} />
        <Route path="/graph/:graphId" element={<ProtectedRoute element={Graph} />} />
        <Route path="/signup" element={<SignUpOrSignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
