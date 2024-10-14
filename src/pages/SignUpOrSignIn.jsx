// src/pages/SignUpOrSignIn.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail, getAuth, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import 'tailwindcss/tailwind.css';

// Initialize Firestore
const firestore = getFirestore();

function SignUpOrSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/graphlist'); 
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (location.state && location.state.isSignUp === false) {
      setIsSignUp(false);
    }
  }, [location.state]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: displayName });

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
      });

      navigate('/graphlist');
    } catch (error) {
      console.error('Error during sign up:', error);
      setError('Failed to create account. Please try again later.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/graphlist');
    } catch (error) {
      console.error('Error during sign in:', error);
      setError('Failed to sign in. Please check your credentials and try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
    
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        console.log('User already exists, signing in...');
      } else {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        console.log('New user created');
      }

      navigate('/graphlist');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again later.');
    }
  };

  const handleForgotPassword = async () => {
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        setError('Password reset email sent!');
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError('Please enter your email to reset your password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-blue-100 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 transform transition-all">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-8 text-center">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-6">
          {isSignUp && (
            <>
              <input
                type="text"
                value={displayName}
                required
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Name"
                className="w-full p-4 border border-gray-300 rounded-full text-lg focus:outline-none focus:border-blue-400 text-center"
              />
            </>
          )}
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-4 border border-gray-300 rounded-full text-lg focus:outline-none focus:border-blue-400 text-center"
          />
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-4 border border-gray-300 rounded-full text-lg focus:outline-none focus:border-blue-400 text-center"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 transition focus:outline-none shadow-lg"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-4">or</p>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-red-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition focus:outline-none shadow-lg"
          >
            {isSignUp ? 'Sign Up with Google' : 'Sign In with Google'}
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpOrSignIn;