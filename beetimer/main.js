secondsPerSecond = 1;
secondsLeft = 600;
eventMessage = "";

document.getElementById("timer").addEventListener("load", mainLoop())

async function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve,  ms * 1000));
}

async function mainLoop() {
    start = new Date();
    while(secondsLeft > 0) {
        document.getElementsByTagName("body")[0].style.background = ""
        event();
        updateTimer();
        await sleep(secondsPerSecond)
    }
    end = new Date();
    time = end - start

    hours = Math.floor(time / 3600000);
    minutes = Math.floor((time - hours * 3600000) / 60000);
    seconds = Math.floor((time - hours * 3600000 - minutes * 60000) / 1000);
    milliseconds = time % 1000

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    if (milliseconds < 10) seconds = "000" + milliseconds;
    if (milliseconds < 100) seconds = "00" + milliseconds;
    
    document.getElementById("timer").textContent = `00:00:00`;
    document.getElementById("info").textContent = `Previous Event: ${eventMessage} | 1s = ${secondsPerSecond}s | Final Time: ${hours}:${minutes}:${seconds}.${milliseconds}`
}

function updateTimer() {
    hours = Math.floor(secondsLeft / 3600);
    minutes = Math.floor((secondsLeft - hours * 3600) / 60);
    seconds = secondsLeft % 60;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    document.getElementById("timer").textContent = `${hours}:${minutes}:${seconds}`;
    document.getElementById("info").textContent = `Previous Event: ${eventMessage} | 1s = ${secondsPerSecond}s`
}

async function event() {
    rng = Math.floor(Math.random() * 100) + 1;
    switch (true) {
        case (rng <= 5):
            secondsLeft++;
            eventMessage = "Added a second to the timer"
            break;
        case (rng <= 6):
            secondsLeft += 60;
            eventMessage = "Added a minute to the timer"
            break;
        case (rng <= 7):
            secondsLeft -= 60;
            eventMessage = "Subtracted a minute from the timer"
            break;
        case (rng <= 12):
            sleep(secondsPerSecond)
            eventMessage = "Froze the timer for one second"
            break;
        case (rng <= 13):
            secondsLeft *= 2;
            eventMessage = "Doubled the remaining time"
            break;
        case (rng <= 14):
            secondsLeft /= 2;
            secondsLeft = Math.round(secondsLeft)
            eventMessage = "Halved the remaining time"
            break;
        case (rng <= 15):
            minutes = Math.floor((secondsLeft) / 60);
            seconds = secondsLeft % 60;

            secondsNew = minutes % 60
            minutesNew = seconds + Math.floor(minutes/60)

            secondsLeft = minutesNew * 60 + secondsNew

            eventMessage = "Swapped minutes and seconds"
            break;
        case (rng <= 16):
            Math.round(secondsLeft/50)*50
            eventMessage = "Rounded time to the nearest minute"
            break;
        case (rng <= 17):
            secondsPerSecond *= 2;
            eventMessage = "Doubled how long a second is"
            break;
        case (rng <= 18):
            secondsPerSecond /= 2;
            eventMessage = "Halved how long a second is"
            break;
        case (rng <= 19):
            bees = new Audio("bee.mp3")
            document.getElementsByTagName("body")[0].style.background = "url('bees.jpg')"
            bees.play()
            eventMessage = "🐝🐝🐝"
            break;
        default:
            secondsLeft--;
            eventMessage = "Subtracted a second from the timer"
    }
}
