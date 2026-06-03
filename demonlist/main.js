// spreadsheet_id = "1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4"
// tabs = ["demonlist", "progress", "bucketlist"]
// https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/${tabnamehere}?raw=true

let mainlevels = [], inprogress = [], upcoming = [], bucketlist = [], packs = [], allLevels = [], levelsNames = []
let attemptsAll = [], enjoymentAll = [], failAll = [], playtimeAll = [], bpmAll = []
let blocked = []
let tokimode = false, allExpanded = false

async function getAredlData(levelID) {

    try {
        const response = await fetch("https://api.aredl.net/v2/api/aredl/levels/" + levelID)
        if (!response.ok) {
            throw new Error("Level doesn't exist")
        }
        const data = await response.json()

        switch (data.name) {
            case "Bruno Mars":
                data.publisher.global_name = "SouljaBoyCrankD"
                break;
            case "Prismatic Haze":
                data.publisher.global_name = "Gizbro"
                break;
            case "Belloq":
                data.publisher.global_name = "Sminx"
                break;
            case "Artificial Ascent":
                data.publisher.global_name = "ViPriN"
                break;
            case "Digital Descent":
                data.publisher.global_name = "ViPriN"
                break;
            case "Chromatic Haze":
                data.publisher.global_name = "Gizbro"
                break;
            case "Cybernetic Crescent":
                data.publisher.global_name = "ViPriN"
                break;
        }

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
        if (!url.includes("packs")) {
            const aredlPromises = spreadsheetResults.map(function (level) {
                return getAredlData(level.ID)
            })
            const aredlResults = await Promise.all(aredlPromises)
            for (i = 0; i < spreadsheetResults.length; i++) {
                spreadsheetData = spreadsheetResults[i]
                aredlData = aredlResults[i]

                if (url.includes("demonlist")) {
                    mainlevels.push(
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
                            playtime: spreadsheetData.playtimeTotal,
                            playtimeSorting: spreadsheetData.playtimeTotal,
                            date: spreadsheetData.date,
                            tokiname: spreadsheetData.tpName,
                            tokicreator: spreadsheetData.tpCreator,
                            youtube: spreadsheetData.youtube,
                            changelog: spreadsheetData.changelog
                        }
                    )
                    levelsNames.push(
                        aredlData.name
                    )
                    time = mainlevels[i].playtimeSorting * 86400
                    mainlevels[i].playtime = playtimeCalc(mainlevels[i].playtime)
                    sheetsDate = new Date(Date.UTC(1899, 11, 30, 0, 0, 0, 0))
                    mainlevels[i].date = new Date((mainlevels[i].date - 25569) * 86400000)
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
        else {
            for (i = 0; i < spreadsheetResults.length; i++) {
                spreadsheetData = spreadsheetResults[i]
                packs.push(
                    {
                        packName: spreadsheetData.packName,
                        levels: spreadsheetData.levels
                    }
                )
                packs[i].levels = packs[i].levels.split(" ")

                packs[i].levels.forEach((level, index) => {
                    let packIndex = i
                    let packtokiname = ""
                    let packtokicreator = ""
                    allLevels.forEach(element => {
                        if (element.id == level) {
                            packtokiname = element.tokiname
                            packtokicreator = element.tokicreator
                        }
                    })

                    const aredlPromises = getAredlData(level)
                    aredlPromises.then(function (data) {
                        packs[packIndex].levels[index] = {
                            name: data.name,
                            creator: data.creator,
                            id: level,
                            aredl: data.aredl_tier,
                            nlw: data.nlw_tier,
                            tokiname: packtokiname,
                            tokicreator: packtokicreator
                        }
                    })
                })
            }
        }
    }

    catch (error) {
        console.error(error)
    }

}

function dateShort(x) {
    return x.toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' })
}

async function buildMain(timeMachine) {
    document.getElementById("loader").style.display = "flex"
    document.getElementById("container").style.display = "none"
    let html = `<a id='hardestinfo'>👑 - current hardest | ⭐ - former hardest</a>`
    if (mainlevels.length == 0) await collectData(`https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/demonlist?raw=true`)
    attemptsAll = mainlevels.map(a => a.attempts)
    enjoymentAll = mainlevels.map(a => a.enjoyment)
    failAll = mainlevels.map(a => a.worstDeath)
    playtimeAll = mainlevels.map(a => a.playtimeSorting)
    bpmAll = mainlevels.map(a => a.bpm)

    playtimeAll = playtimeAll.filter(el => el != "-")
    bpmAll = bpmAll.filter(el => el != "-")

    if (typeof (timeMachine) !== "undefined") {
        mainlevels.forEach(level => {
            if (new Date(level.date) > new Date(timeMachine)) {
                blocked.push(level.name)
            }
        })
    }
    await buildOther()
    mainlevels.forEach(level => {
        if (level.hardest == 1) {
            level.hardest = "⭐"
        }
        else if (level.hardest == 0) {
            level.hardest = ""
        }
        if (level.rank == 1) {
            level.hardest = "👑"
        }
        html += `<div class="level" id="${level.name}" style="background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/${level.id}.webp')">
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
            html += `<h3 class="levelname toki">${level.tokiname} tan ${level.tokicreator}${level.hardest}</h3>`
        }
        else {
            html += `<h3 class="levelname">${level.name} by ${level.creator} ${level.hardest}</h3>`
        }
        html += `
                    <div class="links">
                        <a href="${level.youtube}" target="_blank" class="youtubeLink"><img src="images/youtube.svg" alt="youtube"></a>
                        <a href="https://aredl.net/list/${level.id}" target="_blank" class="aredlLink"><img src="images/aredl.svg" alt="aredl"></a>
                    </div>
                </div>
                    <div class="stats">
                        <div class="generalstats">
            <div>Attempts: ${level.attempts}`; if (level.attempts == Math.min(...attemptsAll)) { html += ` ⬇️` } else if (level.attempts == Math.max(...attemptsAll)) { html += ` ⬆️` }
        html += `</div><div>Enjoyment: ${level.enjoyment}/100`; if (level.enjoyment == Math.min(...enjoymentAll)) { html += ` ⬇️` } else if (level.enjoyment == Math.max(...enjoymentAll)) { html += ` ⬆️` }
        html += `</div><div>Max BPM: ${level.bpm} BPM`; if (level.bpm == Math.min(...bpmAll)) { html += ` ⬇️` } else if (level.bpm == Math.max(...bpmAll)) { html += ` ⬆️` }
        html += `</div><div>Worst Death: ${level.worstDeath}%`; if (level.worstDeath == Math.min(...failAll)) { html += ` ⬇️` } else if (level.worstDeath == Math.max(...failAll)) { html += ` ⬆️` }
        html += `</div><div>Hardest Part: ${level.hardestPart}%</div>`;
        html += `</div>
                        <div class="timestats">
                            <div class="playtime">Level Playtime: ${level.playtime}`; if (level.playtimeSorting == Math.min(...playtimeAll)) { html += ` ⬇️` } else if (level.playtimeSorting == Math.max(...playtimeAll)) { html += ` ⬆️` }
        html += `</div><div class="gdtime">Total GD Playtime: ${level.timeGD}h</div>
                            <div class="date">Completion Date: ${dateShort(level.date)}</div>
                        </div>
                    </div>
                </div>
            </div>`
        document.getElementById("mainlist").innerHTML = html;
    })
    buildTop5()
    document.querySelectorAll("#mainlist .level, #top5progression .level, #inprogress .level").forEach(level => {
        level.addEventListener("click", function (e) {
            if (!e.target.matches("img")) {
                if (this.classList.contains("active")) {
                    document.querySelectorAll(".level").forEach(activeLevel => activeLevel.classList.remove("active"));
                }
                else {
                    document.querySelectorAll(".level").forEach(activeLevel => activeLevel.classList.remove("active"));
                    this.classList.add("active");
                }
            }
            document.getElementById("listexpand").textContent = "expand all"
            allExpanded = false
        });

    })
    blocked.forEach(blockedLevel => {
        console.log(blockedLevel)
        document.getElementById(blockedLevel).style.display = "none"
    })
    document.getElementById("container").style.display = "flex"
    document.getElementById("loader").style.display = "none"
    buildMinor()
    expandAll()

}

function playtimeCalc(time) {
    time = time * 86400
    time = Math.floor(time / 3600).toString().padStart(2, '0') + ":" + Math.floor((time % 3600) / 60).toString().padStart(2, '0') + ":" + (time % 60).toString().padStart(2, '0')
    return time
}

function buildMinor() {
    document.getElementById("totalstats").innerHTML =
        `
                <a>extreme demons: <span class="pink">${mainlevels.length}</span></a>
                <a>total attempts: <span class="pink">${attemptsAll.reduce((total, a) => total + a, 0)} attempts</span></a>
                <a>total playtime: <span class="pink">${playtimeCalc(playtimeAll.reduce((total, a) => total + a, 0))}</span></a>

                <a>average attempts: <span class="pink">${Math.round((attemptsAll.reduce((total, a) => total + a, 0)) / attemptsAll.length)} attempts</span></a>
                <a>average enjoyment: <span class="pink">${Math.round((enjoymentAll.reduce((total, a) => total + a, 0)) / enjoymentAll.length)}/100</span></a>
                <a>average max bpm: <span class="pink">${Math.round((bpmAll.reduce((total, a) => total + a, 0)) / bpmAll.length)} BPM</span></a>
                <a>average worst fail: <span class="pink">${Math.round((failAll.reduce((total, a) => total + a, 0)) / failAll.length)}%</span></a>
                <a>average playtime: <span class="pink">${playtimeCalc((playtimeAll.reduce((total, a) => total + a, 0)) / playtimeAll.length).substring(0, playtimeCalc((playtimeAll.reduce((total, a) => total + a, 0)) / playtimeAll.length).indexOf("."))}</span></a>

                <a>least attempts: <span class="pink">${Math.min(...attemptsAll)} attempts</span> - ${getLevel(Math.min(...attemptsAll), "attempts")}</a>
                <a>highest enjoyment: <span class="pink">${Math.max(...enjoymentAll)}/100</span> - ${getLevel(Math.max(...enjoymentAll), "enjoyment")}</a>
                <a>lowest max bpm: <span class="pink">${Math.min(...bpmAll)} BPM</span> - ${getLevel(Math.min(...bpmAll), "bpm")}</a>
                <a>lowest worst fail: <span class="pink">${Math.min(...failAll)}%</span> - ${getLevel(Math.min(...failAll), "worstDeath")}</a>
                <a>lowest playtime: <span class="pink">${playtimeCalc(Math.min(...playtimeAll))}</span> - ${getLevel(Math.min(...playtimeAll), "playtimeSorting")}</a>

                <a>most attempts: <span class="pink">${Math.max(...attemptsAll)} attempts</span> - ${getLevel(Math.max(...attemptsAll), "attempts")}</a>
                <a>lowest enjoyment: <span class="pink">${Math.min(...enjoymentAll)}/100</span> - ${getLevel(Math.min(...enjoymentAll), "enjoyment")}</a>
                <a>highest max bpm: <span class="pink">${Math.max(...bpmAll)} BPM</span> - ${getLevel(Math.max(...bpmAll), "bpm")}</a>
                <a>highest worst fail: <span class="pink">${Math.max(...failAll)}%</span> - ${getLevel(Math.max(...failAll), "worstDeath")}</a>
                <a>highest playtime: <span class="pink">${playtimeCalc(Math.max(...playtimeAll))}</span> - ${getLevel(Math.max(...playtimeAll), "playtimeSorting")}</a>
`
    html = ""
    mainlevels.sort((a, b) => (a.date < b.date) ? 1 : -1);
    mainlevels.forEach(level => {
        html += `<a><span class="pink">${dateShort(level.date)}</span> - ${level.changelog}</a><br>`
    })
    document.getElementById("changelog").innerHTML = html
    mainlevels.sort((a, b) => (a.rank > b.rank) ? 1 : -1);
}

function getLevel(value, argument) {
    if (mainlevels.filter((element) => element[argument] == value).length == 1) {
        return mainlevels.filter((element) => element[argument] == value)[0].name
    }
    else {
        return mainlevels.filter((element) => element[argument] == value).length + " Levels"
    }
}

async function buildOther() {
    if (inprogress.length == 0) await collectData(`https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/progress?raw=true`)
    if (upcoming.length == 0) await collectData(`https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/upcoming?raw=true`)
    if (bucketlist.length == 0) await collectData(`https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/bucketlist?raw=true`)
    allLevels = allLevels.concat(mainlevels, inprogress, upcoming, bucketlist)
    if (packs.length == 0) await collectData(`https://opensheet.elk.sh/1QbdEQf6EbJJJ25ko4LnEoiStcZFyheAZoFozWy_59n4/packs?raw=true`)
    bucketlist.sort((a, b) => a.aredl < b.aredl ? 1 : -1)
    let html = ""
    inprogress.forEach(level => {
        html += `<div class="level" style="background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/${level.id}.webp')">
                    <div class="otherinfo">`
        if (tokimode) {
            html += `
                <a class="aredl tokiaredl">#${level.aredl} -&nbsp;</a>
                <a class="levelname toki">${level.tokiname} tan ${level.tokicreator}</a>`
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
        if (level.time != storedDate) {
            html += `<h4>${level.time}</h4>`
        }
        storedDate = level.time
        html += `<div class="level" style="background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/${level.id}.webp')">
                    <div class="otherinfo">`
        if (tokimode) {
            html += `
             <a class="aredl tokiaredl">#${level.aredl} -&nbsp;</a>
             <a class="levelname toki">${level.tokiname} tan ${level.tokicreator}</a>`
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
        html += `<div class="level" style="background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/${level.id}.webp')">
                    <div class="otherinfo">`
        if (tokimode) {
            html += `
             <a class="aredl tokiaredl">#${level.aredl} -&nbsp;</a>
             <a class="levelname toki">${level.tokiname} tan ${level.tokicreator}</a>`
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
    buildPacks();
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
        mainlevels.sort((a, b) => (a[condition] > b[condition]) ? 1 : -1);
    }
    else {
        mainlevels.sort((a, b) => (a[condition] < b[condition]) ? 1 : -1);
    }

    buildMain();
})

document.getElementById("top5").addEventListener("click", function () {
    if (document.getElementById("top5progression").style.display == "none" || document.getElementById("top5progression").style.display == "") {
        document.getElementById("mainlist").style.display = "none"
        document.getElementById("packs").style.display = "none"
        document.getElementById("top5progression").style.display = "flex"
        allExpanded = false
        expandAll()
    }
    else {
        document.getElementById("mainlist").style.display = "flex"
        document.getElementById("top5progression").style.display = "none"
        allExpanded = false
        expandAll()
    }
})

document.getElementById("packsButton").addEventListener("click", function () {
    if (document.getElementById("packs").style.display == "none" || document.getElementById("packs").style.display == "") {
        document.getElementById("mainlist").style.display = "none"
        document.getElementById("top5progression").style.display = "none"
        document.getElementById("packs").style.display = "flex"
        allExpanded = false
        expandAll()
    }
    else {
        document.getElementById("mainlist").style.display = "flex"
        document.getElementById("packs").style.display = "none"
        allExpanded = false
        expandAll()
    }
    if (document.getElementById("packs").innerHTML == "") {
        buildPacks()
    }
})


document.getElementById("timetravel").addEventListener("click", function () {
    buildMain(new Date(document.getElementById("timemachinedate").value.toString()))
})

document.getElementById("resettime").addEventListener("click", function () {
    blocked = []
    buildMain()
})

document.getElementById("resetsort").addEventListener("click", function () {
    mainlevels.sort((a, b) => (a.rank > b.rank) ? 1 : -1);
    buildMain()
})

document.getElementById("listexpand").addEventListener("click", function () {
    allExpanded = !allExpanded
    expandAll()
})

function expandAll() {
    if (document.getElementById("mainlist").style.display != "none") {
        if (allExpanded == true) {
            document.querySelectorAll("#mainlist .level").forEach(level => {
                level.classList.add("active");
            });
            document.getElementById("listexpand").textContent = "collapse all"
        }
        else {
            document.querySelectorAll("#mainlist .level").forEach(level => {
                level.classList.remove("active");
            });
            document.getElementById("listexpand").textContent = "expand all"
        }
    }
    else {
        if (allExpanded == true) {
            document.querySelectorAll("#top5progression .level").forEach(level => {
                level.classList.add("active");
            });
            document.getElementById("listexpand").textContent = "collapse all"
        }
        else {
            document.querySelectorAll("#top5progression .level").forEach(level => {
                level.classList.remove("active");
            });
            document.getElementById("listexpand").textContent = "expand all"
        }
    }
}

function buildTop5() {
    dates = []
    mainlevels.sort((a, b) => (a.date < b.date) ? -1 : 1);
    mainlevels.forEach(level => {
        dates.push(level.date)
    })
    mainlevels.sort((a, b) => (a.rank > b.rank) ? 1 : -1);

    allLists = []
    allListsDates = []
    previousList = []

    dates.forEach(date => {
        currentList = []
        mainlevels.forEach(level => {
            if (level.date <= date) {
                if (currentList.length < 5) {
                    currentList.push(level)
                }
            }
        })
        if (JSON.stringify(previousList) != JSON.stringify(currentList) && currentList.length >= 5) {
            allLists.push(currentList)
            allListsDates.push(date)
        }
        previousList = currentList
    })
    html = ""
    listCounter = 0
    allLists.forEach(list => {
        html += `<div class="top5old"><a class="dateTop5">${dateShort(allListsDates[listCounter])}</a>`
        levelCounter = 1;
        list.forEach(level => {
            html += `<div class="level" style="background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/${level.id}.webp')">
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
                html += `<h3 class="levelname toki">${level.tokiname} tan ${level.tokicreator}${level.hardest}</h3>`
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
                            <div class="date">Completion Date: ${dateShort(level.date)}</div>
                        </div>
                    </div>
                </div>
            </div>`
            levelCounter++
        })


        html += `<marquee direction="right" loop="infinite"> >>> Scroll to the right to see more >>> Scroll to the right to see more >>> Scroll to the right to see more >>> Scroll to the right to see more >>> Scroll to the right to see more >>> </marquee>
        </div>`
        listCounter++
    })

    document.getElementById("top5progression").innerHTML = html
}

function buildPacks() {
    html = ""
    packs.forEach(pack => {
        completionCounter = 0;
        header = `<h2>${pack.packName}`
        levelSection = ""
        pack.levels.sort((a, b) => a.aredl > b.aredl ? 1 : -1)
        pack.levels.forEach(level => {
            if (levelsNames.includes(level.name)) {
                levelSection += `<div class="level" style="background-image: linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/${level.id}.webp')">`
                completionCounter++
            }
            else {
                levelSection += `<div class="level" style="background-image: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/${level.id}.webp'); filter: grayscale(100%)">`
            }
            levelSection += `<div class="otherinfo">`
            if (tokimode) {
                levelSection += `
                         <a class="aredl tokiaredl">#${level.aredl} -&nbsp;</a>
                         <a class="levelname toki">${level.tokiname} tan ${level.tokicreator}</a>`
            } //fuck you
            else {
                levelSection += `
                         <a class="aredl">#${level.aredl} -&nbsp;</a>
                         <a class="levelname">${level.name} by ${level.creator}</a>`
            }
            levelSection += `</div></div>`
        })
        header += ` (${completionCounter}/${pack.levels.length})</h2>`

        html += header + levelSection
    })
    document.getElementById("packs").innerHTML = html

}