import React, { useEffect, useState } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disable, setDisable] = useState(false);
  const [won, setWon] = useState(false);

  const handleGridSizeChange = (e) => {
    console.log(e);
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() * 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));
    setCards(shuffledCards);
    setFlipped([]);
    setWon(false);
    setSolved([]);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisable(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisable(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    console.log(id);
    if (disable || won) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisable(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisable(false);
      }
    }
  };

  console.log(flipped);

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  return (
    <div className="memory-container">
      <h3 className="memory-title">MEMORY GAME</h3>
      <div className="grid-container">
        <label htmlFor="gridSize">Grid Size: (max 10)</label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSizeChange}
          className="grid-input"
        />
      </div>
      <div
        className="memory-grid"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            className={`memory-card ${
              isFlipped(card.id)
                ? isSolved(card.id)
                  ? "flipped-solved"
                  : "flipped"
                : "hidden-card"
            }`}
          >
            {isFlipped(card.id) ? card.number : "?"}
          </div>
        ))}
      </div>

      {/* Result */}
      {won && <div className="win-text">You Won!</div>}

      {/* Reset / Play Again */}
      <button onClick={initializeGame} className="reset-btn">
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
