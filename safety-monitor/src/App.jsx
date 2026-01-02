import React from 'react';
import Dashboard from './Dashboard'; 
// Make sure you don't have any other "Sidebar" imports here

function App() {
  return (
    <div className="App">
      {/* The Dashboard handles the full layout now */}
      <Dashboard />
    </div>
  );
}

export default App;