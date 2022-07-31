// import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';

// import profile from './new_profilephoto.jpg';
// import profile from './profilePhoto.JPG';
// import logo from './logo.svg';
import './App.css';
import Header from './Header.js';
import Main from './Main.js';


function App() {
  document.title = "alexcwarren.com";

  return (
    <>
      <Header />
      <Main />
    </>
  );
}

export default App;
