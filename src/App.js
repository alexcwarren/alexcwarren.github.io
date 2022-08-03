// import BrowserRouter from "react-router-dom";
// import Redirect from "react-router-dom";
// import Route from "react-router";
// import Switch from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styling/App.scss";
import "./styling/App.css";

import LaunchPage from "./components/LaunchPage.js"

function App() {
  document.title = "AlexCWarren.com";
  document.body.style.background = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--primary1");

  return (
    <LaunchPage />
    // <>
    //   <BrowserRouter>
    //     <Switch>
    //       <Route exact path="/" component={LaunchPage} />
    //     </Switch>
    //   </BrowserRouter>
    // </>
  );
}

export default App;
