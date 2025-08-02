import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandleBlow from './components/CandleBlow';
import CoinFlip from './components/CoinFlip';
import ScratchCard from './components/ScratchCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandleBlow />} />
        <Route path="/coin" element={<CoinFlip />} />
        <Route path="/scratch" element={<ScratchCard />} />
      </Routes>
    </Router>
  );
}

export default App;
