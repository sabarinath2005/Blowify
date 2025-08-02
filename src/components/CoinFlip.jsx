import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import coinImg from '../assets/coin.png';
import useSound from 'use-sound';
import flipSound from '../assets/flip.mp3';
import confetti from 'canvas-confetti';

const CoinFlip = () => {
  const [tries, setTries] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [result, setResult] = useState(null);
  const [rotating, setRotating] = useState(false);
  const [flipStyle, setFlipStyle] = useState('rotateY');
  const [message, setMessage] = useState('Try your luck!');
  const navigate = useNavigate();
  const [play] = useSound(flipSound);

  const tips = [
    "Did you try blowing on it?",
    "Try flipping it with your left hand!",
    "Maybe blink 3 times before clicking.",
    "The coin likes compliments.",
    "Third time's the charm!",
    "Try channeling your inner magician.",
  ];

  const flipCoin = () => {
    if (rotating || tries >= 6) return;

    setRotating(true);
    play();
    setMessage('Flipping...');
    setResult(null);

    setTimeout(() => {
      const isHead = Math.random() > 0.7;
      const newTries = tries + 1;

      setTries(newTries);
      setResult(isHead);
      setRotating(false);

      if (isHead) {
        setMessage('🎉 You got HEAD!');
        setHasWon(true);
        confetti();
        setTimeout(() => {
          alert('🎉 You got HEAD!');
          navigate('/scratch');
        }, 300);
      } else {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setMessage(`❌ No head. ${randomTip}`);
        if (newTries === 6) {
          setTimeout(() => {
            alert("😢 You have no luck!");
            navigate('/scratch');
          }, 300);
        }
      }
    }, 1000);
  };

  const meterPercentage = (tries / 6) * 100;

  return (
    <div className="level" style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>🪙 Flip the Coin</h1>

      {/* Flip Style Selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="flipStyle" style={{ marginRight: '10px' }}>
          Flip Style:
        </label>
        <select
          id="flipStyle"
          value={flipStyle}
          onChange={(e) => setFlipStyle(e.target.value)}
          style={{ padding: '5px', fontSize: '14px' }}
        >
          <option value="rotateY">Rotate Y (Default)</option>
          <option value="rotateX">Rotate X</option>
          <option value="rotateZ">Crazy Spin (Z)</option>
        </select>
      </div>

      {/* Coin Image */}
      <img
        src={coinImg}
        alt="Coin"
        style={{
          height: '120px',
          transition: 'transform 1s',
          transform: rotating ? `${flipStyle}(720deg)` : 'none',
          marginBottom: '1rem'
        }}
      />
      <br />

      {/* Flip Button */}
      <button
        onClick={flipCoin}
        disabled={rotating || tries >= 6}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '10px',
          backgroundColor: rotating ? '#ccc' : '#28a745',
          color: '#fff',
          cursor: rotating ? 'not-allowed' : 'pointer',
          border: 'none'
        }}
      >
        {rotating ? 'Flipping...' : 'Flip'}
      </button>

      {/* Lucky Meter */}
      <div style={{ marginTop: '1.5rem', width: '80%', marginInline: 'auto' }}>
        <p style={{ marginBottom: '5px' }}>🎯 Lucky Meter</p>
        <div
          style={{
            height: '20px',
            width: '100%',
            borderRadius: '10px',
            backgroundColor: '#eee',
            overflow: 'hidden',
            border: '1px solid #ccc',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${meterPercentage}%`,
              backgroundColor: hasWon
                ? '#28a745'
                : tries === 6
                ? '#dc3545'
                : '#ffc107',
              transition: 'width 0.5s ease'
            }}
          ></div>
        </div>
      </div>

      {/* Message */}
      <div style={{ marginTop: '1rem', fontSize: '20px' }}>
        <p>{message}</p>
        {result !== null && (
          <p style={{ fontSize: '40px' }}>{result ? '✅' : '❌'}</p>
        )}
        <p>Tries: {tries} / 6</p>
      </div>
    </div>
  );
};

export default CoinFlip;
