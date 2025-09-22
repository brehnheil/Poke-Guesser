import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Navbar from "./components/Navbar";
import HowToPlay from "./pages/HowToPlay";
import Protected from "./components/Protected";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/howtoplay" element={<HowToPlay />} />
            <Route path="/profile" element={<Protected><Profile /></Protected>} />
            <Route path="/leaderboard" element={<Leaderboard />}/>
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
