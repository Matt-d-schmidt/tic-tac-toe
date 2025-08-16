const gameMode = document.getElementById("game-mode");
const players = document.querySelectorAll(".player");
const gameSummary = document.querySelector(".game-summary");
const gamePlace = document.querySelector(".game-cards");
const gameCards = document.querySelectorAll(".game-cards .card");
const winnerMsgs = document.querySelectorAll(".winner");
const drawMsg = document.querySelector(".draw");

const game = (function () {
    const playGame = () => {
        gameCards.forEach((card) => {
            card.addEventListener("click", () => {
                const choosenPlayer = document.querySelector(".choosen .name");
                const otherPlayer = document.querySelector(
                    ".player:not(.choosen) .name"
                );
                const choosenScore = document.querySelector(".choosen .score");
                gamePlace.classList.add("starting");
                if (card.innerHTML === "") {
                    createShape(choosenPlayer.textContent, card);
                    summarizeGame(otherPlayer);
                    removeAddChoosen(otherPlayer);
                    checkWinner(choosenPlayer, choosenScore);
                    if (gameMode.value === "pc") {
                        setTimeout(() => {
                            const choosenPlayer = document.querySelector(".choosen .name");
                            const otherPlayer = document.querySelector(
                                ".player:not(.choosen) .name"
                            );
                            const choosenScore = document.querySelector(".choosen .score");
                            dynamicCard(choosenPlayer.textContent);
                            if (gamePlace.classList.contains("starting")) {
                                summarizeGame(otherPlayer);
                                removeAddChoosen(otherPlayer);
                                checkWinner(choosenPlayer, choosenScore);
                            }
                        }, 500);
                    }
                }
            });
        });
    };

    const dynamicCard = (shape) => {
        let filter = Array.from(gameCards).filter((card) => card.innerHTML === "");
        let randomIndex = Math.floor(Math.random() * filter.length);
        createShape(shape, filter[randomIndex]);
    };

    const createShape = (shape, ele) => {
        let div = document.createElement("div");
        div.className = `${shape}-shape`;
        ele.appendChild(div);
    };

    const removeAddChoosen = (ele) => {
        players.forEach((player) => player.classList.remove("choosen"));
        ele.parentElement.classList.add("choosen");
    };

    const summarizeGame = (ele) => {
        let array = Array.from(gameCards).filter((card) => card.innerHTML === "");
        if (array.length) {
            gameSummary.innerHTML = `<span>${ele.textContent.toUpperCase()}</span> Turn`;
        } else {
            gameSummary.innerHTML = "Game Over";
        }
    };

    const checkWinner = (ele, score) => {
        let winningCombos = [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [1, 4, 7],
            [2, 5, 8],
            [2, 4, 6],
            [3, 4, 5],
            [6, 7, 8],
        ];

        const hasWinner = winningCombos.some(([a, b, c]) => {
            let vA = gameCards[a].innerHTML;
            let vB = gameCards[b].innerHTML;
            let vC = gameCards[c].innerHTML;
            return vA !== "" && vA === vB && vB === vC;
        });

        if (hasWinner) {
            winnerIs(ele, score);
            gamePlace.classList.remove("starting");
            return;
        }

        let array = Array.from(gameCards).every((card) => card.innerHTML !== "");
        if (array) {
            drawMsg.classList.add("show");
            players.forEach((player) => player.classList.remove("choosen"));
            gameSummary.textContent = "Game Over";
            gamePlace.classList.remove("starting");
        }
    };

    const winnerIs = (ele, score) => {
        document.querySelector(`.${ele.textContent}-winner`).classList.add("show");
        setTimeout(() => {
            if (!drawMsg.classList.contains("show")) {
                if (score.textContent == "-") {
                    score.textContent = 1;
                } else {
                    score.textContent++;
                }
            }
        }, 0);
        gameSummary.textContent = "Game Over";
        removeAddChoosen(score);
    };

    const resetGame = () => {
        gameCards.forEach((card) => (card.innerHTML = ""));
        winnerMsgs.forEach((msg) => msg.classList.remove("show"));
        removeAddChoosen(players[0].firstElementChild);
        gamePlace.classList.remove("starting");
        gameSummary.textContent = "Start Game Or Select Player";
    };
    return { playGame, resetGame, removeAddChoosen };
})();

game.playGame();

gameMode.addEventListener("change", () => {
    game.resetGame();
    players.forEach((player) => {
        player.querySelector(".score").innerHTML = "-";
    });
});

players.forEach((player) => {
    player.addEventListener("click", () => {
        if (!gamePlace.classList.contains("starting")) {
            game.removeAddChoosen(player.firstElementChild);
        }
    });
});

window.addEventListener("keydown", (e) => {
    if (e.key === "r") {
        game.resetGame();
    }
});

document
    .querySelector(".restart")
    .addEventListener("click", () => game.resetGame());