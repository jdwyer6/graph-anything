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
import { useNavigate, useParams } from 'react-router-dom';

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
  const [error, setError] = useState('');
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGraph = async () => {
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
        }
      }
    };

    fetchGraph();
  }, [userId, graphId]);

  const addPoint = async () => {
    if (inputValue && graph) {
      try {
        const updatedData = [...(graph.data || []), Number(inputValue)];
        const updatedGraph = { ...graph, data: updatedData };

        const userDocRef = doc(firestore, 'users', userId);
        await updateDoc(userDocRef, {
          graphs: userData.graphs.map((g) => (g.graphId === graphId ? updatedGraph : g)),
        });

        setGraph(updatedGraph);
        setInputValue('');
      } catch (error) {
        console.error('Error updating graph data:', error);
        setError('Failed to add point. Please try again.');
      }
    }
  };

  if (!graph) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: graph.data.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Dataset',
        data: graph.data,
        fill: false,
        borderColor: '#6A8D92',
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: '#FF7F50',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
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
          display: true,
          text: graph.xLabel,
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
        beginAtZero: true,
        title: {
          display: true,
          text: graph.yLabel,
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
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-10 text-center">
          {graph.title}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="flex gap-6 mb-10 justify-center">
          <input
            type="number"
            placeholder="Enter Y value"
            className="p-4 border border-gray-300 rounded-full text-center text-lg focus:outline-none focus:border-blue-400 w-1/4 max-w-sm"
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
        <div className="bg-white p-6 rounded-3xl shadow-lg mb-10">
          <Line data={chartData} options={chartOptions} />
        </div>
        <button
          className="bg-gray-500 text-white px-6 py-4 rounded-full text-lg font-semibold hover:bg-gray-600 transition focus:outline-none shadow-lg"
          onClick={() => navigate('/graphlist')}
        >
          Back to Graphs
        </button>
      </div>
    </div>
  );
}

export default Graph;