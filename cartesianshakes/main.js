const LevelCoords = [
    //dimx, dimy, s1x, s1y, s2x, s2y, hx, hy
    ["11", "6", "1", "3", "10", "3", "4", "1"],
    ["11", "3", "1", "2", "10", "2", "3", "2"],
    ["11", "4", "1", "2", "10", "1", "6", "2"],
    ["11", "7", "1", "6", "10", "4", "4", "3"],
    ["7", "5", "1", "2", "6", "3", "3", "2"],
    ["11", "6", "6", "1", "7", "1", "5", "3"],
    ["11", "7", "1", "6", "10", "3", "5", "3"],
    ["13", "6", "1", "4", "12", "2", "5", "2"],
    ["9", "6", "6", "3", "6", "2", "5", "1"],
    ["9", "7", "3", "1", "8", "6", "7", "4"],
    ["12", "7", "2", "1", "10", "1", "6", "2"],
    ["9", "6", "1", "5", "8", "1", "7", "5"],
    ["9", "7", "1", "4", "8", "3", "3", "2"],
    ["7", "5", "2", "1", "6", "1", "2", "3"],
    ["9", "7", "1", "6", "8", "1", "6", "6"],
    ["8", "6", "2", "4", "5", "4", "4", "2"],
    ["9", "7", "3", "2", "7", "2", "3", "1"],
    ["10", "7", "4", "4", "6", "6", "6", "1"],
    ["13", "7", "2", "3", "12", "6", "5", "1"],
    ["10", "7", "1", "1", "8", "6", "4", "4"],
    ["9", "5", "1", "4", "8", "1", "4", "1"],
    ["13", "7", "1", "6", "12", "6", "7", "6"],
    ["9", "7", "3", "4", "8", "3", "5", "4"],
    ["9", "7", "3", "2", "5", "3", "8", "5"],
    ["11", "6", "1", "3", "10", "2", "6", "3"],
    ["14", "6", "1", "3", "13", "3", "6", "3"],
    ["13", "7", "4", "3", "8", "2", "3", "1"],
    ["14", "7", "2", "1", "6", "4", "11", "4"],
    ["13", "7", "3", "6", "10", "6", "6", "1"],
    ["12", "8", "5", "1", "8", "4", "4", "8"],
];

let stored = "";
let levelID = 99;
let levelText = ""
let guessCheck = ""
let totalLevels = 0
let correctLevels = 0
function start() {
    document.getElementById("startButton").style.display = "none";
    document.getElementById("previousStats").style.display = "flex";

    newLevel();

    addEventListener("keydown", function (e) {
        if (e.key == "Backspace") {
            stored = "";
        }
        stored += e.key.replace(/\D/g, "");
        if (stored.length == 2) {
            if (stored == levelID) {
                guessCheck = "✅"
                correctLevels++
            } else {
                guessCheck = "❌"
            }
            totalLevels++
            document.getElementById("previousLevel").textContent = `Previous Level: Level ${levelID} - ${levelText}`
            document.getElementById("previousGuess").textContent = `Previous Guess: Level ${stored} ${guessCheck}`
            document.getElementById("winRatio").textContent = `Win Ratio: ${correctLevels}/${totalLevels} (${Math.floor((correctLevels/totalLevels)*10000)/100}%)`
            stored = "";
            newLevel();  
        }
        document.getElementById("input").textContent = stored;
    });
}

function newLevel() {
    levelID = Math.floor(Math.random() * 30);

    levelText = "(0, 0)";
    for (i = 0; i <= 7; i++) {
        if (i % 2 == 0) {
            levelText += " (" + LevelCoords[levelID][i] + ", ";
        } else {
            levelText += LevelCoords[levelID][i] + ")";
        }
    }
    if (levelID < 10) {
        levelID = "0" + levelID;
    }
    document.getElementById("level").textContent = levelText;
}
