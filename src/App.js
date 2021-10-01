import profile from './profilePhoto.JPG';
import logo from './logo.svg';
import './App.css';

function App() {
  document.title = "alexcwarren.com";

  return (
    <div className="App">
      <header className="App-header">
        <img src={profile} className="Profile" alt="profile" />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <span>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          , Alex Warren.
        </span>
      </header>
    </div>
  );
}

export default App;