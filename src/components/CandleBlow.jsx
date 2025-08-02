import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import candleImg from "../assets/candle.png";
import flameImg from "../assets/flame.png";
import windImg from "../assets/wind.png";
import blowSound from "../assets/blow.mp3";
import "./mainstyle.css";

const CandleBlow = () => {
  const [blown, setBlown] = useState(false);
  const [showWind, setShowWind] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const THRESHOLD = 180;

  useEffect(() => {
    let audioContext, analyser, microphone, dataArray;

    const detectBlow = () => {
      analyser.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setVolumeLevel(avg);

      if (avg > THRESHOLD && !blown) {
        setBlown(true);
        setShowWind(true);
        audioRef.current.play();
        setTimeout(() => navigate("/coin"), 1500);
      }

      requestAnimationFrame(detectBlow);
    };

    const initMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        microphone = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        microphone.connect(analyser);
        detectBlow();
      } catch (err) {
        console.error("Mic error:", err);
      }
    };

    initMic();

    return () => {
      if (audioContext) audioContext.close();
    };
  }, [blown]);

  return (
    <div className="level" style={{ textAlign: "center", paddingTop: "50px" }}>
      <h1>🕯️ Blow the Candle</h1>

      <div style={{ position: "relative", display: "inline-block" }}>
        <img src={candleImg} alt="Candle" style={{ height: "200px" }} />

        {!blown && (
          <img
            src={flameImg}
            alt="Flame"
            style={{
              position: "absolute",
              
              left: "50%",
              transform: "translateX(-50%)",
              height: "60px",
            }}
          />
        )}

        {showWind && (
          <img
            src={windImg}
            alt="Wind"
            style={{
              position: "absolute",
            
              left: "30%",
              width: "150px",
              animation: "windMove 3s ease-out",
            }}
          />
        )}
      </div>

      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        Blow into your mic to extinguish the candle!
      </p>
      <p style={{ fontSize: "12px", color: "#888" }}>
        Mic Volume: {Math.round(volumeLevel)} / Threshold: {THRESHOLD}
      </p>

      <audio ref={audioRef} src={blowSound} preload="auto" />
    </div>
  );
};

export default CandleBlow;
