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
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

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
  const [newXValue, setNewXValue] = useState('Day');
  const [newYValue, setNewYValue] = useState('Count');
  const [selectedEmoji, setSelectedEmoji] = useState(null);
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
            let graphsData = userData.graphs || [];
        
            if (typeof graphsData === 'object' && !Array.isArray(graphsData)) {
              graphsData = Object.values(graphsData);
            }
  
            setGraphs(graphsData);
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

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji.native);
  };

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
          xValue: newXValue,
          yValue: newYValue,
          emoji: selectedEmoji,
          data: [],
        };
  
        // Add the new graph to the Firestore document
        await updateDoc(userDocRef, {
          graphs: arrayUnion(newGraph),
        });
  
        setGraphs((prevGraphs) => [...prevGraphs, newGraph]);
        setShowForm(false); // Hide the form after creating the graph
        setNewGraphTitle('');
        setNewXValue('');
        setNewYValue('');
        setSelectedEmoji(null);
        navigate(`/graph/${graphId}`);
      } else {
        throw new Error('User document does not exist');
      }
    } catch (error) {
      console.error('Error creating graph:', error);
      setError(error.message);
    }
  };
  
  // Existing Graph Click Handler
  const handleGraphClick = (graphId) => {
    setShowForm(false); // Ensure form is hidden
    navigate(`/graph/${graphId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-blue-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-10 text-center">My Graphs</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {graphs.map((graph) => (
            <div
              key={graph.graphId}
              className="bg-white p-6 rounded-3xl shadow-lg cursor-pointer hover:bg-gray-100 transition"
              onClick={() => handleGraphClick(graph.graphId)}
            >
              <div>
                <div className="text-6xl text-blue-500 mb-4">{graph.emoji}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{graph.title}</h2>
              </div>

              {/* Graph Preview */}
              <div className="h-40">
              {graph.data.length ? (
                <Line
                  data={{
                    labels: graph.data.map((_, index) => index + 1) || [1, 2, 3, 4], // Placeholder if no data
                    datasets: [
                      {
                        label: graph.title,
                        data: graph.data.length ? graph.data : [0, 2, 1, 3], // Placeholder data if no data is present
                        borderColor: '#388087',
                        borderWidth: 2,
                        fill: false,
                        pointRadius: 2,
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        display: false,
                      },
                      y: {
                        display: false,
                      },
                    },
                  }}
                />
                
              ) : (
                <p className="text-gray-500 text-center mt-4">Click to start adding data</p>
              )}
              </div>
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
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-12">
          <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New Graph</h2>
            <div className="grid gap-6 mb-8">
              <div className="flex flex-col items-start">
                <label htmlFor="newGraphTitle" className="ml-6">Graph Title</label>
                <input
                  type="text"
                  required
                  placeholder="Graph Title"
                  className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400 w-full"
                  value={newGraphTitle}
                  onChange={(e) => setNewGraphTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="newGraphTitle" className="ml-6">Y-Axis Label</label>
                <input
                  type="text"
                  placeholder="X-Axis Label"
                  className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400 w-full"
                  value={newXValue}
                  onChange={(e) => setNewXValue(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="newGraphTitle" className="ml-6">X-Axis Label</label>
                <input
                  type="text"
                  placeholder="Y-Axis Label"
                  className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400 w-full"
                  value={newYValue}
                  onChange={(e) => setNewYValue(e.target.value)}
                />
              </div>
              <div className="flex items-start">
                <div>
                  <label htmlFor="iconSelector">Select Emoji</label>
                  <Picker data={data} onEmojiSelect={handleEmojiSelect} />
                </div>
                <div className="w-full h-full items-center flex justify-center">
                  {selectedEmoji ? (
                    <div className="text-6xl text-blue-500 mb-4">{selectedEmoji}</div>
                  ) : ('Select an emoji')}
                </div>
              </div>
              <button
                className="bg-blue-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 transition focus:outline-none shadow-lg"
                onClick={handleCreateGraph}
              >
                Create Graph
              </button>
              <button
                className="bg-red-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition focus:outline-none shadow-lg"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GraphList;