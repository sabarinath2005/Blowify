import { useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import "./ScratchCard.css";

const WIN_PROBABILITY = 0.5;

const ScratchCard = () => {
  const canvasRef = useRef(null);
  const messageRef = useRef(null);

  const [result, setResult] = useState(null); // 'win' or 'lose'
  const [showGiftButton, setShowGiftButton] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState("");
  const [giftLink, setGiftLink] = useState("");

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.style.display = "block";
    messageRef.current.style.opacity = "0";
    canvas.width = 300;
    canvas.height = 150;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    initializeCanvas();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let isScratching = false;

    const scratch = (e) => {
      if (!isScratching) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.touches ? e.touches[0].clientX - rect.left : e.offsetX;
      const y = e.touches ? e.touches[0].clientY - rect.top : e.offsetY;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
    };

    const checkScratch = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let total = imageData.length / 4;
      let scratched = 0;
      for (let i = 3; i < imageData.length; i += 4) {
        if (imageData[i] === 0) scratched++;
      }
      if (scratched / total > 0.4) {
        canvas.style.display = "none";
        messageRef.current.style.opacity = "1";
        const didWin = Math.random() < WIN_PROBABILITY;
        setResult(didWin ? "win" : "lose");
        setShowGiftButton(didWin);
      }
    };

    const startScratch = (e) => {
      isScratching = true;
      scratch(e);
    };

    const endScratch = () => {
      isScratching = false;
      checkScratch();
    };

    canvas.addEventListener("mousedown", startScratch);
    canvas.addEventListener("mousemove", scratch);
    canvas.addEventListener("mouseup", endScratch);
    canvas.addEventListener("touchstart", startScratch);
    canvas.addEventListener("touchmove", scratch);
    canvas.addEventListener("touchend", endScratch);

    return () => {
      canvas.removeEventListener("mousedown", startScratch);
      canvas.removeEventListener("mousemove", scratch);
      canvas.removeEventListener("mouseup", endScratch);
      canvas.removeEventListener("touchstart", startScratch);
      canvas.removeEventListener("touchmove", scratch);
      canvas.removeEventListener("touchend", endScratch);
    };
  }, [result]);

  const handleGiftButton = () => {
    setShowNameInput(true);
  };

  const handleSubmitName = () => {
    const link = "https://youtube.com/shorts/6QpDt_SASY0?si=sjtHNLRIKvogIUY0";
    setGiftLink(link);
  };

  const handleRetry = () => {
    setResult(null);
    setShowGiftButton(false);
    setShowNameInput(false);
    setName("");
    setGiftLink("");
    initializeCanvas();
  };

  return (
    <div className="scratch-card-container">
      <h1>🎰 Scratch to Reveal</h1>
      <canvas ref={canvasRef} style={{ border: "2px solid #333" }} />

      <div ref={messageRef} style={{ opacity: 0, transition: "opacity 1s" }}>
        {result === "win" && <h2>🎉 You Won!</h2>}
        {result === "lose" && (
          <>
            <h2>😢 Try Again</h2>
            <button className="retry-btn" onClick={handleRetry}>
              🔁 Retry
            </button>
          </>
        )}
      </div>

      {result === "win" && (
        <button className="gift-btn" onClick={handleGiftButton}>
          🎁 Go to Gift
        </button>
      )}

      {showNameInput && (
        <div className="name-section">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleSubmitName}>Submit</button>
        </div>
      )}

      {giftLink && (
        <div className="gift-result">
          <p>
            🎁 Your Gift:{" "}
            <a href={giftLink} target="_blank" rel="noreferrer">
              {giftLink}
            </a>
          </p>
          <QRCode value={giftLink} size={160} />
        </div>
      )}
    </div>
  );
};

export default ScratchCard;
