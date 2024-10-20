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
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';
import { customEmojis } from '../utils/customEmojis';

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
  const fullConfig = resolveConfig(tailwindConfig);
  const borderColor = fullConfig.theme.colors['gray-dark'];

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
    if (emoji.native) {
      setSelectedEmoji(emoji.native);
    } else {
      setSelectedEmoji(emoji.src);
    }
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

  const handleGraphClick = (graphId) => {
    setShowForm(false); 
    navigate(`/graph/${graphId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-blue-100 flex flex-col items-center justify-center pb-4 md:pb-8 px-2 md:px-8 pt-16 md:pt-28">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 md:p-10">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-10 text-center">My Graphs</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {graphs.map((graph) => (
            <div
              key={graph.graphId}
              className="bg-white p-6 rounded-3xl shadow-lg cursor-pointer hover:bg-gray-100 transition flex flex-col justify-around"
              onClick={() => handleGraphClick(graph.graphId)}
            >
              {/* Graph Preview */}
              <div className="h-40 mb-4">
              {graph.data.length ? (
                <Line
                  data={{
                    labels: graph.data.map((_, index) => index + 1) || [1, 2, 3, 4],
                    datasets: [
                      {
                        label: graph.title,
                        data: graph.data.length ? graph.data : [0, 2, 1, 3],
                        borderColor: borderColor,
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
              <div className="flex items-center justify-center gap-2">
                {graph.emoji ? (
                  typeof graph.emoji === 'string' && (graph.emoji.startsWith('/') || graph.emoji.startsWith('http'))
                    ? <img src={graph.emoji} alt="custom emoji" className="inline-block max-w-24" />
                    : <div className="text-blue-500 text-5xl">{graph.emoji}</div>
                ) : (
                  'Select an emoji'
                )}
                <h2 className="text-2xl font-bold text-gray-800">{graph.title}</h2>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-md md:max-w-2xl lg:max-w-4xl absolute top-0 md:top-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Create New Graph</h2>
            <div className="grid gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="flex flex-col items-start">
                <label htmlFor="newGraphTitle" className="ml-2 sm:ml-4">Graph Title</label>
                <input
                  type="text"
                  required
                  placeholder="Graph Title"
                  className="p-3 sm:p-4 border border-gray-300 rounded-full text-center text-base sm:text-lg focus:outline-none focus:border-blue-400 w-full"
                  value={newGraphTitle}
                  onChange={(e) => setNewGraphTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="newXValue" className="ml-2 sm:ml-4">Y-Axis Label</label>
                <input
                  type="text"
                  placeholder="X-Axis Label"
                  className="p-3 sm:p-4 border border-gray-300 rounded-full text-center text-base sm:text-lg focus:outline-none focus:border-blue-400 w-full"
                  value={newXValue}
                  onChange={(e) => setNewXValue(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="newYValue" className="ml-2 sm:ml-4">X-Axis Label</label>
                <input
                  type="text"
                  placeholder="Y-Axis Label"
                  className="p-3 sm:p-4 border border-gray-300 rounded-full text-center text-base sm:text-lg focus:outline-none focus:border-blue-400 w-full"
                  value={newYValue}
                  onChange={(e) => setNewYValue(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-start w-full">
                <label htmlFor="iconSelector" className="ml-2 sm:ml-4 mb-2">Select Emoji</label>
                <div className="flex flex-col sm:flex-row items-center justify-between w-full">
                  <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} custom={customEmojis} style={{ width: '100%' }} />
                  </div>
                  <div className="flex justify-center items-center w-full sm:w-auto">
                    {selectedEmoji ? (
                      typeof selectedEmoji === 'string' && (selectedEmoji.startsWith('/') || selectedEmoji.startsWith('http'))
                        ? <img src={selectedEmoji} alt="custom emoji" className="inline-block p-3 max-w-24 h-auto" />
                        : <div className="text-blue-500 text-6xl sm:text-9xl">{selectedEmoji}</div>
                    ) : (
                      'Select an emoji'
                    )}
                  </div>
                </div>
              </div>
              <button
                className="bg-blue-500 text-white px-6 py-3 sm:py-4 rounded-full text-lg font-semibold hover:bg-blue-600 transition focus:outline-none shadow-lg w-full mb-4"
                onClick={handleCreateGraph}
              >
                Create Graph
              </button>
              <button
                className="bg-red-500 text-white px-6 py-3 sm:py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition focus:outline-none shadow-lg w-full"
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