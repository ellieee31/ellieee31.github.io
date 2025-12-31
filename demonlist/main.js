// spreadsheet_id = "1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4"
// tabs = ["demonlist", "progress", "bucketlist"]
// https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/${tabnamehere}?raw=true

const levels = [], inprogress = [], upcoming = [], bucketlist = []
let attemptsAll = [], enjoymentAll = [], failAll = [], playtimeAll = [], aredlverifAll = [], bpmAll = []
let blocked = []
let tokimode = false, allExpanded = false

async function getAredlData(levelID) {

    try {
        const response = await fetch("https://api.aredl.net/v2/api/aredl/levels/" + levelID)
        if (!response.ok) {
            throw new Error("Level doesn't exist")
        }
        const data = await response.json()
        return {
            name: data.name,
            creator: data.publisher.global_name,
            nlw_tier: data.nlw_tier,
            aredl_tier: data.position
        }
    }

    catch (error) {
        console.error(error)
    }

}

async function collectData(url) {

    try {
        const res = await fetch(url)
        const spreadsheetResults = await res.json()

        const aredlPromises = spreadsheetResults.map(function (level) {
            return getAredlData(level.ID)
        })
        const aredlResults = await Promise.all(aredlPromises)
        for (i = 0; i < spreadsheetResults.length; i++) {
            spreadsheetData = spreadsheetResults[i]
            aredlData = aredlResults[i]
            if (url.includes("demonlist")) {
                levels.push(
                    {
                        name: aredlData.name,
                        creator: aredlData.creator,
                        id: spreadsheetData.ID,
                        rank: spreadsheetData.rank,
                        aredl: aredlData.aredl_tier,
                        nlw: aredlData.nlw_tier,
                        hardest: spreadsheetData.hardest,
                        attempts: spreadsheetData.attempts,
                        enjoyment: spreadsheetData.enjoyment,
                        bpm: spreadsheetData.bpm,
                        worstDeath: spreadsheetData.worstDeath,
                        hardestPart: spreadsheetData.hardestPart,
                        timeGD: spreadsheetData.timeGD,
                        timeAREDL: spreadsheetData.timeAREDL,
                        playtime: spreadsheetData.playtimeTotal,
                        playtimeSorting: spreadsheetData.playtimeTotal,
                        date: spreadsheetData.date,
                        tokiname: spreadsheetData.tpName,
                        tokicreator: spreadsheetData.tpCreator,
                        changelog: spreadsheetData.changelog
                    }
                )
                time = levels[i].playtimeSorting * 86400
                levels[i].playtime = playtimeCalc(levels[i].playtime)
                sheetsDate = new Date(Date.UTC(1899, 11, 30, 0, 0, 0, 0))
                levels[i].date = new Date((levels[i].date - 25569) * 86400000).toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' })
            }
            else if (url.includes("progress")) {
                inprogress.push(
                    {
                        name: aredlData.name,
                        creator: aredlData.creator,
                        id: spreadsheetData.ID,
                        aredl: aredlData.aredl_tier,
                        nlw: aredlData.nlw_tier,
                        runs: spreadsheetData.runs,
                        estimatedRank: spreadsheetData.estimatedRank,
                        tokiname: spreadsheetData.tpName,
                        tokicreator: spreadsheetData.tpCreator
                    }
                )
            }
            else if (url.includes("upcoming")) {
                upcoming.push(
                    {
                        name: aredlData.name,
                        creator: aredlData.creator,
                        id: spreadsheetData.ID,
                        aredl: aredlData.aredl_tier,
                        nlw: aredlData.nlw_tier,
                        time: spreadsheetData.time,
                        tokiname: spreadsheetData.tpName,
                        tokicreator: spreadsheetData.tpCreator
                    }
                )
            }
            else if (url.includes("bucketlist")) {
                bucketlist.push(
                    {
                        name: aredlData.name,
                        creator: aredlData.creator,
                        id: spreadsheetData.ID,
                        aredl: aredlData.aredl_tier,
                        nlw: aredlData.nlw_tier,
                        tokiname: spreadsheetData.tpName,
                        tokicreator: spreadsheetData.tpCreator
                    }
                )
            }
        }
    }

    catch (error) {
        console.error(error)
    }

}

async function buildMain(timeMachine) {
    document.getElementById("loader").style.display = "flex"
    document.getElementById("container").style.display = "none"
    let html = "<a id='hardestinfo'>👑 - current hardest | ⭐ - former hardest</a>"
    if (levels.length == 0) await collectData(`https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/demonlist?raw=true`)
    attemptsAll = levels.map(a => a.attempts)
    enjoymentAll = levels.map(a => a.enjoyment)
    failAll = levels.map(a => a.worstDeath)
    playtimeAll = levels.map(a => a.playtimeSorting)
    aredlverifAll = levels.map(a => a.timeAREDL)
    bpmAll = levels.map(a => a.bpm)

    playtimeAll = playtimeAll.filter(el => el != "-")
    aredlverifAll = aredlverifAll.filter(el => el != "-")
    bpmAll = bpmAll.filter(el => el != "-")

    if (typeof (timeMachine) !== "undefined") {
        levels.forEach(level => {
            if (new Date(level.date) > new Date(timeMachine)) {
                blocked.push(level.name)
            }
        })
    }

    levels.forEach(level => {
        if (level.hardest == 1) {
            level.hardest = "⭐"
        }
        if(level.rank == 1){
            level.hardest = "👑"
        }
        if (level.hardest == 0) {
            level.hardest = ""
        }
        html += `<div class="level" id="${level.name}">
                <div class="rank">`
        if (level.aredl == 1) {
            html += `<img class="difficulty" src="demons/grandpa.png" alt="grandpa">`
        }
        else if (level.aredl <= 25) {
            html += `<img class="difficulty" src="demons/infinite.png" alt="infinite">`
        }
        else if (level.aredl <= 75) {
            html += `<img class="difficulty" src="demons/mythical.png" alt="mythical">`
        }
        else if (level.aredl <= 150) {
            html += `<img class="difficulty" src="demons/legendary.png" alt="legendary">`
        }
        else if (level.aredl <= 250) {
            html += `<img class="difficulty" src="demons/ultimate.png" alt="ultimate">`
        }
        else if (level.aredl <= 500) {
            html += `<img class="difficulty" src="demons/supreme.png" alt="supreme">`
        }
        else {
            html += `<img class="difficulty" src="demons/extreme.png" alt="extreme">`
        }
        html += `<h3 class="placement">#${level.rank}</h3>
                    <a class="aredl">AREDL #${level.aredl}</a>
                    <a class="nlw">${level.nlw} Tier</a>
                </div>
                <div class="info">
                    <div class="levelinfo">`
        if (tokimode) {
            html += `<h3 class="levelname toki">${level.tokiname} tan jan ${level.tokicreator}${level.hardest}</h3>`
        }
        else {
            html += `<h3 class="levelname">${level.name} by ${level.creator} ${level.hardest}</h3>`
        }
        html += `</div>
                    <div class="stats">
                        <div class="generalstats">
                            <div>Attempts: ${level.attempts}</div>
                            <div>Enjoyment: ${level.enjoyment}/100</div>
                            <div>Max BPM: ${level.bpm} BPM</div>
                            <div>Worst Death: ${level.worstDeath}%</div>
                            <div>Hardest Part: ${level.hardestPart}%</div>
                        </div>
                        <div class="timestats">
                            <div class="playtime">Level Playtime: ${level.playtime}</div>
                            <div class="gdtime">Total GD Playtime: ${level.timeGD}h</div>
                            <div class="aredltime">AREDL Verification Time: ${level.timeAREDL} days</div>
                            <div class="date">Completion Date: ${level.date}</div>
                        </div>
                    </div>
                </div>
            </div>`
        document.getElementById("mainlist").innerHTML = html;
    })
    await buildOther()
    thumbnails()
    buildMinor()
    document.querySelectorAll(".level").forEach(level => {
        level.addEventListener("click", function () {
            if (this.classList.contains("active")) {
                document.querySelectorAll(".level").forEach(activeLevel => activeLevel.classList.remove("active"));
            }
            else {
                document.querySelectorAll(".level").forEach(activeLevel => activeLevel.classList.remove("active"));
                this.classList.add("active");
            }
            document.getElementById("listexpand").textContent = "expand all"
                allExpanded = false
        });

    })
    blocked.forEach(blockedLevel => {
        document.getElementById(blockedLevel).style.display = "none"
    })
    document.getElementById("container").style.display = "flex"
    document.getElementById("loader").style.display = "none"
    expandAll()
}

function playtimeCalc(time) {
    time = time * 86400
    time = Math.floor(time / 3600).toString().padStart(2, '0') + ":" + Math.floor((time % 3600) / 60).toString().padStart(2, '0') + ":" + (time % 60).toString().padStart(2, '0')
    return time
}

function thumbnails() {
    levels.forEach(level => {
        document.getElementById(level.name).style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/" + level.id + ".webp')"
    });
    inprogress.forEach(level => {
        document.getElementById(level.name).style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/" + level.id + ".webp')"
    });
    upcoming.forEach(level => {
        document.getElementById(level.name).style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/" + level.id + ".webp')"
    });
    bucketlist.forEach(level => {
        document.getElementById(level.name).style.backgroundImage = "linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/" + level.id + ".webp')"
    });
}

function buildMinor() {
    document.getElementById("totalstats").innerHTML =
        `
                <a>extreme demons: ${levels.length}</a>
                <a>total attempts: ${attemptsAll.reduce((total, a) => total + a, 0)} attempts</a>
                <a>total playtime: ${playtimeCalc(playtimeAll.reduce((total, a) => total + a, 0))}</a>

                <a>average attempts: ${(attemptsAll.reduce((total, a) => total + a, 0)) / attemptsAll.length} attempts</a>
                <a>average enjoyment: ${(enjoymentAll.reduce((total, a) => total + a, 0)) / enjoymentAll.length}/100</a>
                <a>average max bpm: ${(bpmAll.reduce((total, a) => total + a, 0)) / bpmAll.length} BPM</a>
                <a>average worst fail: ${(failAll.reduce((total, a) => total + a, 0)) / failAll.length}%</a>
                <a>average playtime: ${playtimeCalc((playtimeAll.reduce((total, a) => total + a, 0)) / playtimeAll.length)}</a>
                <a>average aredl verification time: ${(aredlverifAll.reduce((total, a) => total + a, 0)) / aredlverifAll.length} days</a>

                <a>least attempts: ${Math.min(...attemptsAll)} attempts</a>
                <a>highest enjoyment: ${Math.max(...enjoymentAll)}/100</a>
                <a>lowest max bpm: ${Math.min(...bpmAll)} BPM</a>
                <a>lowest worst fail: ${Math.min(...failAll)}%</a>
                <a>lowest playtime: ${playtimeCalc(Math.min(...playtimeAll))}</a>
                <a>lowest aredl verification time: ${Math.min(...aredlverifAll)} days</a>

                <a>most attempts: ${Math.max(...attemptsAll)} attempts</a>
                <a>lowest enjoyment: ${Math.min(...enjoymentAll)}/100</a>
                <a>highest max bpm: ${Math.max(...bpmAll)} BPM</a>
                <a>highest worst fail: ${Math.max(...failAll)}%</a>
                <a>highest playtime: ${playtimeCalc(Math.max(...playtimeAll))}</a>
                <a>highest aredl verification time: ${Math.max(...aredlverifAll)} days</a>
`
    html = ""
    levels.sort((a, b) => (a.date < b.date) ? 1 : -1);
    levels.forEach(level => {
        html += "<a>" + level.date + " - " + level.changelog + "</a><br>"
    })
    document.getElementById("changelog").innerHTML = html
    levels.sort((a, b) => (a.rank > b.rank) ? 1 : -1);
}

async function buildOther() {
    if (inprogress.length == 0) await collectData(`https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/progress?raw=true`)
    if (upcoming.length == 0) await collectData(`https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/upcoming?raw=true`)
    if (bucketlist.length == 0) await collectData(`https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/bucketlist?raw=true`)
    bucketlist.sort((a, b) => a.aredl < b.aredl ? 1 : -1)
    let html = ""
    inprogress.forEach(level => {
        html += `<div class="level" id="${level.name}">
                    <div class="otherinfo">`
        if (tokimode) {
            html += `
                <a class="aredl tokiaredl">#${level.aredl} -&nbsp;</a>
                <a class="levelname toki">${level.tokiname} tan jan ${level.tokicreator}</a>`
        }
        else {
            html += `
             <a class="aredl">#${level.aredl} -&nbsp;</a>
             <a class="levelname">${level.name} by ${level.creator}</a>`
        }
        html += `</div>
        <div class="otherruns">Runs: ${level.runs}</div>
        </div>
        `
    })
    document.getElementById("inprogress").innerHTML = html
    html = ""
    storedDate = ""
    upcoming.forEach(level => {
        if(level.time != storedDate){
        html += `<h4>${level.time}</h4>`
        }
        storedDate = level.time
        html += `<div class="level" id="${level.name}">
                    <div class="otherinfo">`
        if (tokimode) {
            html += `
             <a class="aredl tokiaredl">#${level.aredl} -&nbsp;</a>
             <a class="levelname toki">${level.tokiname} tan jan ${level.tokicreator}</a>`
        }
        else {
            html += `
             <a class="aredl">#${level.aredl} -&nbsp;</a>
             <a class="levelname">${level.name} by ${level.creator}</a>`
        }
        html += `</div></div>`
    })
    document.getElementById("upcoming").innerHTML = html
    html = ""
    bucketlist.forEach(level => {
        html += `<div class="level" id="${level.name}">
                    <div class="otherinfo">`
        if (tokimode) {
            html += `
             <a class="aredl tokiaredl">#${level.aredl} -&nbsp;</a>
             <a class="levelname toki">${level.tokiname} tan jan ${level.tokicreator}</a>`
        }
        else {
            html += `
             <a class="aredl">#${level.aredl} -&nbsp;</a>
             <a class="levelname">${level.name} by ${level.creator}</a>`
        }
        html += `</div></div>`
    })
    document.getElementById("bucketlist").innerHTML = html
}

document.getElementById("toki").addEventListener("click", function () {
    tokimode = !tokimode
    buildMain();
});

document.getElementById("sortingoptions").addEventListener("click", function () {
    if (document.getElementById("sorting").style.display == "flex") {
        document.getElementById("sorting").style.display = "none"
    }
    else {
        document.getElementById("sorting").style.display = "flex"
        document.getElementById("timemachine").style.display = "none"
    }
})

document.getElementById("time").addEventListener("click", function () {
    if (document.getElementById("timemachine").style.display == "flex") {
        document.getElementById("timemachine").style.display = "none"
    }
    else {
        document.getElementById("timemachine").style.display = "flex"
        document.getElementById("sorting").style.display = "none"
    }
})

document.getElementById("sort").addEventListener("click", function () {
    condition = document.getElementById("sortType").value;
    direction = document.getElementById("sortMode").value;
    if (direction == "asc") {
        levels.sort((a, b) => (a[condition] > b[condition]) ? 1 : -1);
    }
    else {
        levels.sort((a, b) => (a[condition] < b[condition]) ? 1 : -1);
    }
    buildMain();
})

document.getElementById("timetravel").addEventListener("click", function () {
    buildMain(new Date(document.getElementById("timemachinedate").value.toString()))
})

document.getElementById("resettime").addEventListener("click", function () {
    blocked = []
    buildMain()
})

document.getElementById("resetsort").addEventListener("click", function () {
    levels.sort((a, b) => (a.rank > b.rank) ? 1 : -1);
    buildMain()
})

document.getElementById("listexpand").addEventListener("click", function () {
    allExpanded = !allExpanded
    expandAll()
})

function expandAll() {
    if (allExpanded == true) {
        document.querySelectorAll("#mainlist .level").forEach(level => {
            level.classList.add("active");
        });
        document.getElementById("listexpand").textContent = "collapse all"
    }
    else{
        document.querySelectorAll("#mainlist .level").forEach(level => {
            level.classList.remove("active");
        });
        document.getElementById("listexpand").textContent = "expand all"
    }
}
