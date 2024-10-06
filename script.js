body {
    background: linear-gradient(to bottom, #0d1b2a, #1b2631, #1c3f72);
    color: #ffffff;
    font-family: 'Arial', sans-serif;
    overflow: hidden;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

h1 {
    text-align: center;
    margin: 20px 0;
    font-size: 36px;
}

.menu, .game {
    display: none;
    flex-direction: column;
    align-items: center;
}

.menu.active, .game.active {
    display: flex;
}

#size-select {
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    border: none;
    font-size: 16px;
}

#board {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    grid-gap: 10px;
    margin: 20px;
}

.tile {
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    border-radius: 5px;
    transition: background-color 0.3s, transform 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.tile:hover {
    transform: scale(1.05);
}

.number {
    position: absolute;
    font-size: 24px;
    color: #ffffff;
    pointer-events: none;
}

button {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #3d5a80;
    color: #ffffff;
    font-size: 16px;
    transition: background-color 0.3s, transform 0.2s;
}

button:hover {
    background-color: #98c9e0;
    transform: scale(1.05);
}

#score, #high-score {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 18px;
}

#reset-button {
    align-self: center;
    margin-top: 20px;
}

/* Falling numbers animation */
@keyframes fall {
    to {
        transform: translateY(100vh);
        opacity: 0;
    }
}

.number {
    animation: fall linear forwards;
}
