import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebase';
import './index.css';
import './App.css';
import Graph from './pages/Graph';
import Home from './pages/Home';
import SignUpOrSignIn from './pages/SignUpOrSignIn';
import GraphList from './pages/GraphList';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

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
      <Header user={user} handleLogout={handleLogout}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graphlist" element={<ProtectedRoute element={GraphList} />} />
        <Route path="/graph/:graphId" element={<ProtectedRoute element={Graph} />} />
        <Route path="/signup" element={<SignUpOrSignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
