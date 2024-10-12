# Graph Anything 

## Overview
This project is a **Graph Anything** built using **React**, **Firebase Firestore**, and **Chart.js**. Users can create, view, and interact with graphs by adding data points dynamically. It provides a simple way for users to create custom graphs and store them securely in their own user-specific Firestore collections.

## Features
- **User Authentication**: Users can sign up, log in, and manage their sessions with Firebase Authentication.
- **Graph Creation**: Users can create new graphs with custom titles, x-axis labels, and y-axis labels.
- **Interactive Graphs**: Graphs are displayed using **Chart.js**, and users can add data points to the graph in real-time.
- **Firestore Integration**: All user-created graphs are saved to **Firebase Firestore**, allowing secure, persistent data storage.

## Technologies Used
- **React**: Frontend framework for building user interfaces.
- **Firebase Firestore**: Backend-as-a-Service to manage and store user data, specifically the graph configurations.
- **Firebase Authentication**: User authentication and management.
- **Chart.js**: To provide an interactive graphing solution.
- **Tailwind CSS**: For styling and ensuring a responsive, modern UI.

## Getting Started
### Prerequisites
- **Node.js** (v14 or above)
- **npm** or **yarn** installed
- A Firebase project set up in the [Firebase Console](https://console.firebase.google.com/)

### Installation
1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-username/graph-visualization-app.git
   cd graph-visualization-app
   ```
2. **Install Dependencies**
   ```sh
   npm install
   ```
   or
   ```sh
   yarn install
   ```
3. **Configure Firebase**
   - Create a `.env` file in the root directory of your project.
   - Add your Firebase configuration details:
     ```env
     VITE_REACT_APP_API_KEY=your_api_key
     VITE_REACT_APP_AUTH_DOMAIN=your_auth_domain
     VITE_REACT_APP_PROJECT_ID=your_project_id
     VITE_REACT_APP_STORAGE_BUCKET=your_storage_bucket
     VITE_REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_REACT_APP_APP_ID=your_app_id
     VITE_REACT_APP_MEASUREMENT_ID=your_measurement_id
     ```
4. **Run the Development Server**
   ```sh
   npm run dev
   ```
   or
   ```sh
   yarn dev
   ```
   Your app will be accessible at `http://localhost:3000`.

## Usage
1. **Sign Up or Sign In**: Users must create an account or log in to start creating and managing graphs.
2. **Create a Graph**: Click on "New Graph", enter the title, x-axis label, and y-axis label, then save.
3. **Add Data Points**: Navigate to the graph detail page and add y-values to expand your dataset in real-time.

## Project Structure
- **/src/pages/GraphList.jsx**: The main page for viewing all user graphs and creating new graphs.
- **/src/pages/Graph.jsx**: Component for viewing and interacting with an individual graph.
- **/src/firebase.js**: Firebase configuration and initialization.
- **/src/styles**: Tailwind CSS is used for a modern and responsive UI.

## Firebase Configuration
This project uses Firestore for storing user-specific graph data. Ensure you have proper Firestore rules to secure the data:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
These rules allow users to read and write only their own documents, ensuring data privacy and security.

## Known Issues
- **Unauthorized Domain Errors**: If Google Sign-In isn't working, ensure your domain (e.g., `localhost`) is added to the **Authorized Domains** in Firebase Authentication settings.
- **Graph Not Found Error**: If a graph can't be found, ensure the graph data is saved properly in Firestore and that you have valid permissions set.

## Future Improvements
- **Enhanced Data Editing**: Add options to edit and delete data points.
- **Graph Export**: Allow users to export their graphs as images or CSV files.
- **Collaboration**: Allow multiple users to collaborate on the same graph.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments
- **Firebase** for backend support.
- **Chart.js** for the graph visualization.
- **Tailwind CSS** for a clean and responsive UI.

Feel free to contribute to this project or provide feedback by submitting an issue or pull request on GitHub!

