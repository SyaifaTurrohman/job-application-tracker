import './App.css';
import ApplicationList from './components/ApplicationList.jsx';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="app-eyebrow">Personal archive</p>
        <h1 className="app-title">Job Application Tracker</h1>
        <p className="app-subtitle">Every lead, filed and followed up.</p>
      </header>
      <ApplicationList />
    </div>
  );
}

export default App;
