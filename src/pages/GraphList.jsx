// src/pages/GraphList.jsx
import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'tailwindcss/tailwind.css';
import { auth } from '../firebase';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Initialize Firestore
const firestore = getFirestore();

function GraphList() {
  const [graphs, setGraphs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newGraphTitle, setNewGraphTitle] = useState('');
  const [newXLabel, setNewXLabel] = useState('');
  const [newYLabel, setNewYLabel] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchGraphs = async () => {
      if (userId) {
        try {
          const userDocRef = doc(firestore, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setGraphs(userData.graphs || []);
          } else {
            setError('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching graphs:', error);
          setError('Failed to fetch graphs. Please try again.');
        }
      }
    };

    fetchGraphs();
  }, [userId]);

  const handleCreateGraph = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const graphId = Date.now().toString();
        const newGraph = {
          graphId: graphId,
          title: newGraphTitle,
          xLabel: newXLabel,
          yLabel: newYLabel,
          data: [],
        };

        // If the "graphs" field doesn't exist, create it as an array and add the new graph
        await updateDoc(userDocRef, {
          graphs: arrayUnion(newGraph),
        });

        setGraphs((prevGraphs) => [...prevGraphs, newGraph]);
        setShowForm(false);
        navigate(`/graph/${graphId}`);
      } else {
        throw new Error('User document does not exist');
      }
    } catch (error) {
      console.error('Error creating graph:', error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-blue-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-10 text-center">Your Graphs</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {graphs.map((graph) => (
            <div
              key={graph.graphId}
              className="bg-white p-6 rounded-3xl shadow-lg cursor-pointer hover:bg-gray-100 transition"
              onClick={() => navigate(`/graph/${graph.graphId}`)}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{graph.title}</h2>
              <p className="text-gray-600">X-Axis: {graph.xLabel}</p>
              <p className="text-gray-600">Y-Axis: {graph.yLabel}</p>
            </div>
          ))}
          <div
            className="flex items-center justify-center bg-white p-6 rounded-3xl shadow-lg cursor-pointer hover:bg-gray-100 transition"
            onClick={() => setShowForm(true)}
          >
            <div className="text-center">
              <div className="text-6xl text-blue-500 mb-4">+</div>
              <p className="text-xl font-bold text-gray-800">New Graph</p>
            </div>
          </div>
        </div>
        {showForm && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New Graph</h2>
            <div className="grid gap-6 mb-8">
              <input
                type="text"
                placeholder="Graph Title"
                className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400"
                value={newGraphTitle}
                onChange={(e) => setNewGraphTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="X-Axis Label"
                className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400"
                value={newXLabel}
                onChange={(e) => setNewXLabel(e.target.value)}
              />
              <input
                type="text"
                placeholder="Y-Axis Label"
                className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400"
                value={newYLabel}
                onChange={(e) => setNewYLabel(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 transition focus:outline-none shadow-lg"
                onClick={handleCreateGraph}
              >
                Create Graph
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GraphList;