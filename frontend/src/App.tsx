import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Homepage from "./components/pages/Home";
import Recommender from "./components/pages/Recommender";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/recommender" element={<Recommender />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
