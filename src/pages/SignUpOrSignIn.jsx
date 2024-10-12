// src/pages/SignUpOrSignIn.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, query, getDocs, setDoc, doc } from 'firebase/firestore';
import 'tailwindcss/tailwind.css';

// Initialize Firestore
const firestore = getFirestore();

function SignUpOrSignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/graphlist'); // Redirect to graph if user is signed in
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    logUsersCollection();
  }, []);

  const logUsersCollection = async () => {
    try {
      const q = query(collection(firestore, 'users'));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      console.log(items);
    } catch (error) {
      console.error('Error fetching users collection:', error);
      setError('Missing or insufficient permissions to access users collection.');
    }
  };


  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
      });

      navigate('/graphlist');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/graphlist');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create user document in Firestore if it doesn't exist
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
      }, { merge: true });

      navigate('/graphlist');
    } catch (error) {
      setError(error.message);
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
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full p-4 border border-gray-300 rounded-full text-lg focus:outline-none focus:border-blue-400 text-center"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full p-4 border border-gray-300 rounded-full text-lg focus:outline-none focus:border-blue-400 text-center"
              />
            </>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-4 border border-gray-300 rounded-full text-lg focus:outline-none focus:border-blue-400 text-center"
          />
          <input
            type="password"
            value={password}
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