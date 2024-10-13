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
      <div className="header absolute w-full shadow-lg bg-white flex px-12 py-4 justify-between">
        <h1 className="text-3xl font-black">Graph Anything</h1>
        <div className="flex gap-2 items-center">
          {user && (
            <>
              <p className="user-email">Logged in as: {user.displayName}</p>
              <button className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
        
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
