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
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSettings, FiArrowLeft } from 'react-icons/fi';

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

function Graph() {
  const { graphId } = useParams();
  const [graph, setGraph] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [graphs, setGraphs] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [currentGraphId, setCurrentGraphId] = useState(null);
  const [settingsTitle, setSettingsTitle] = useState('');
  const [settingsXValue, setSettingsXValue] = useState('');
  const [settingsYValue, setSettingsYValue] = useState('');
  const [error, setError] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchGraph = async (userId) => {
    if (userId && graphId) {
      try {
        const userDocRef = doc(firestore, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const graphData = userData.graphs.find((g) => g.graphId === graphId);
          if (graphData) {
            setGraph(graphData);
          } else {
            setError('Graph not found');
          }
        } else {
          setError('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching graph:', error);
        setError('Failed to fetch graph. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchGraph(user.uid);
      } else {
        navigate('/graphlist');
      }
    });
  
    return () => unsubscribe();
  }, [graphId, navigate]);

  const openSettingsModal = (graph) => {
    setCurrentGraphId(graph.graphId);
    setSettingsTitle(graph.title);
    setSettingsXValue(graph.XValue);
    setSettingsYValue(graph.yValue);
    setShowSettings(true);
  };

  const addPoint = async () => {
    if (inputValue && graph) {
      try {
        console.log("Graph data: ", graph.data)
        const updatedData = [...(graph.data || []), parseFloat(inputValue)];

  
        const userDocRef = doc(firestore, 'users', userId);
  
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const updatedGraphs = userData.graphs.map((g) => {
            if (g.graphId === graph.graphId) {
              return { ...g, data: updatedData };
            }
            return g;
          });
  
          await updateDoc(userDocRef, {
            graphs: updatedGraphs,

          });
  
          setGraph({ ...graph, data: updatedData }); 
          setInputValue('');
        } else {
          throw new Error('User document does not exist');
        }
      } catch (error) {
        console.error('Error updating graph data:', error);
        setError('Failed to add point. Please try again.');
      }
    }
  };
  
  const handleDeleteGraph = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
  
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const updatedGraphs = userDoc.data().graphs.filter(g => g.graphId !== currentGraphId);
  
        await updateDoc(userDocRef, {
          graphs: updatedGraphs,
        });
  
        setGraphs(updatedGraphs); // Update the state with the filtered list
        setShowSettings(false); // Hide the settings modal after deleting the graph
        navigate('/graphlist');
      } else {
        throw new Error('User document does not exist');
      }
    } catch (error) {
      console.error('Error deleting graph:', error);
      setError(error.message);
    }
  };
  

  const handleUpdateGraph = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
  
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const updatedGraphs = userDoc.data().graphs.map(g => {
          if (g.graphId === currentGraphId) {
            return {
              ...g,
              title: settingsTitle,
              XValue: settingsXValue,
              yValue: settingsYValue,
            };
          }
          return g;
        });
  
        await updateDoc(userDocRef, {
          graphs: updatedGraphs,
        });
  
        setGraph(updatedGraphs.find(g => g.graphId === currentGraphId));
        setShowSettings(false); // Hide the settings modal after updating the graph
      } else {
        throw new Error('User document does not exist');
      }
    } catch (error) {
      console.error('Error updating graph:', error);
      setError(error.message);
    }
  };

  if (!graph) {
    return <div>Loading...</div>;
  }
 
  const chartData = {
    labels: graph.data ? graph.data.map((_, index) => index + 1) : [],
    datasets: [
      {
        label: 'Dataset',
        data: graph.data,
        fill: false,
        borderColor: '#6A8D92',
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: 'red',
        tension: 0.4,
      },
    ],
  };

  console.log("ChartData Dataset:", chartData.datasets[0].data); // Add this line to see the data being passed to chart


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: graph.title,
        font: {
          size: 30,
          weight: '600',
        },
        color: '#4A4A4A',
        padding: { top: 20, bottom: 30 },
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: graph.XValue,
          font: {
            size: 18,
            weight: '500',
          },
          color: '#6A8D92',
          padding: 10,
        },
        grid: {
          color: '#F0F0F0',
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: graph.yValue,
          font: {
            size: 18,
            weight: '500',
          },
          color: '#6A8D92',
          padding: 10,
        },
        grid: {
          color: '#F0F0F0',
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 to-blue-100 flex flex-col items-center justify-center p-8">
      <div className="w-full bg-white rounded-3xl shadow-xl p-10 relative">
        <div className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer" onClick={(e) => {e.stopPropagation(); openSettingsModal(graph);}}><FiSettings size={24} /></div>
        <div className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 cursor-pointer" onClick={() => navigate('/graphlist')}><FiArrowLeft size={24} /></div>
        <div className="flex w-full justify-center items-center gap-2">
          <div className="text-6xl text-blue-500">{graph.emoji}</div>
          <h1 className="text-4xl font-extrabold text-gray-700 text-center">
            {graph.title}
          </h1>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-10">
          <Line data={chartData} options={chartOptions} />
        </div>
        <div className="flex gap-6 mb-10 justify-center flex-col">
          <input
            type="number"
            placeholder="Enter Y value"
            className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400 w-full"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 transition focus:outline-none shadow-lg w-full"
            onClick={addPoint}
          >
            Add a Point
          </button>
        </div>
      </div>
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Graph Settings</h2>
            <div className="grid gap-6 mb-8">
              <div className="text-start">
                <label htmlFor="newGraphTitle" className="ml-6">Title</label>
                <input
                  type="text"
                  placeholder="Graph Title"
                  className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400 w-full"
                  value={settingsTitle}
                  onChange={(e) => setSettingsTitle(e.target.value)}
                />
              </div>
              <div className="text-start">
                <label htmlFor="newGraphTitle" className="ml-6">X-Axis Label</label>
                <input
                  type="text"
                  placeholder="X-Axis Label"
                  className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400 w-full"
                  value={settingsXValue}
                  onChange={(e) => setSettingsXValue(e.target.value)}
                />
              </div>
              <div className="text-start">
                <label htmlFor="newGraphTitle" className="ml-6">Y-Axis Label</label>
                <input
                  type="text"
                  placeholder="Y-Axis Label"
                  className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400 w-full"
                  value={settingsYValue}
                  onChange={(e) => setSettingsYValue(e.target.value)}
                />
              </div>

              <button
                className="bg-red-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition focus:outline-none shadow-lg w-full"
                onClick={() => setShowDeleteConfirmation(true)}>
                Delete Graph
              </button>
              <div className="flex gap-4">
                <button
                  className="bg-gray-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-gray-600 transition focus:outline-none shadow-lg w-full"
                  onClick={() => setShowSettings(false)}>Cancel</button>
                <button
                  className="bg-blue-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 transition focus:outline-none shadow-lg w-full"
                  onClick={handleUpdateGraph}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6 text-center">Are you sure you want to delete this graph? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                className="bg-gray-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-gray-600 transition focus:outline-none shadow-lg w-full"
                onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
              <button
                className="bg-red-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition focus:outline-none shadow-lg w-full"
                onClick={handleDeleteGraph}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Graph;