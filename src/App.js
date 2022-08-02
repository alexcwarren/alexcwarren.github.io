import 'bootstrap/dist/css/bootstrap.min.css';
import './styling/App.scss';
import './styling/App.css';

import Header from './Header.js';
import Main from './Main.js';
import CardCarousel from './CardCarousel.js';
import Footer from './Footer.js';

function App() {
  document.title = 'alexcwarren.com';
  document.body.style.background = getComputedStyle(
    document.documentElement
  ).getPropertyValue('--primary1');

  return (
    <>
      <Header />
      <Main />
      <CardCarousel />
      <Footer />
    </>
  );
}

export default App;
