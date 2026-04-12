let today = Date.now()

let maPonaDate = new Date(2025, 3, 6)
let acuDate = new Date(2022, 7, 22)
let voiceDate = new Date(2024, 11, 20)
let artDate = new Date(2025, 0, 3)
let fnafDate = new Date (2025, 1, 9)

let ellieDates = [maPonaDate, acuDate, voiceDate, artDate, fnafDate]
let ellieDescriptions = [`of ellie not joining ma pona`, `of ellie not having beaten Acu`, `of ellie not voice training`, `of ellie not learning how to draw`, `of ellie not finishing her fnaf fangame`]

let duolingoDate = new Date(2025, 2, 27)
let colonistDate = new Date(2025, 11, 20)
let deltaruneDate= new Date(2025, 5, 4)

let modaDates = [duolingoDate, colonistDate, deltaruneDate]
let modaDescriptions = [`of moda not doing his Duolingo lessons`, `of moda not playing Colonist`, `of moda not playing Deltarune`]

function getDayAmount(x) {
    time = today - x
    return Math.floor(time / 86400000)
}

function getDayName(x) {
    options = {
        year: "numeric",
        month: "numeric",
        day: "numeric"
    };
    return x.toLocaleString("en-US", options)
}

function addTimers(dates, descs, person) {
    html = ""
    for (i = 0; i < dates.length; i++) {
        html += `<div class="timer"><div class="dayAmount">Day `
        html += getDayAmount(dates[i])
        html += `</div><div class="dateToNow">(`
        html += getDayName(dates[i])
        html += ` - today)</div><div class="since">`
        html += descs[i]
        html += `</div></div>`
    }
    if (person == "ellie"){
        document.getElementById("ellie").innerHTML = html
    }
    else if (person == "moda"){
        document.getElementById("moda").innerHTML = html
    }
}

addTimers(ellieDates, ellieDescriptions, "ellie")
addTimers(modaDates, modaDescriptions, "moda")