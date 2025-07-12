const levels = [
    //[id, attempt count, enjoyment, worst death, completion date]
]

const inprogress = [
    //[id, runs?]
    [91701349, '66, 54-96, 40-82, 28-71, 19-70'],
    [95764848, '72, 25-100x2'],
    [87425029, '86, 19-83x2, 19-87, 59-100x3']
]

const bucketlist = [76196489, 80335620, 93916671, 60284098, 59899374, 68848817, 88244926, 62869408, 71216292, 64658786, 78164953]

async function fetchData(levelID) {

    try {
        const response = await fetch("https://api.aredl.net/v2/api/aredl/levels/" + levelID)
        if (!response.ok) {
            throw new Error("Level doesn't exist")
        }
        const data = await response.json()

        //stupid
        /*
        if (levelID==91701349){
            data.name = "suno monsi"
            data.publisher.global_name = "jan Kote"
        }
        if (levelID==95764848){
            data.name = "telo lon tenpo pini"
            data.publisher.global_name = "jan Tasi"
        }
        if (levelID==87425029){
            data.name = "kasi mute"
            data.publisher.global_name = "jan Teno"
        }
        */

        return {
            name: data.name,
            creator: data.publisher.global_name,
            gddl_tier: Math.floor(data.gddl_tier),
            nlw_tier: data.nlw_tier,
            aredl_tier: data.position
        }
    }

    catch (error) {
        console.error(error)
    }

}

async function buildmain(levelID, place) {
    const levelData = await fetchData(levelID)
    build(place + 1, levelData.name, levelData.creator, levels[place][1], levels[place][2], levels[place][3], levels[place][4], levelData.nlw_tier, levelData.gddl_tier, levelData.aredl_tier)
    document.getElementById(levelData.name).style.backgroundImage = "url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/" + levelID + ".webp')"
    document.getElementById(levelData.name).style.backgroundSize = "cover"
    document.getElementById(levelData.name).style.backgroundPosition = "center"
}

async function buildleft(levelID, runs) {
    const levelData = await fetchData(levelID)
    build(0, levelData.name, levelData.creator, 0, 0, runs, 0, levelData.nlw_tier, levelData.gddl_tier, levelData.aredl_tier)
    document.getElementById(levelData.name).style.backgroundImage = "url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/" + levelID + ".webp')"
    document.getElementById(levelData.name).style.backgroundSize = "cover"
    document.getElementById(levelData.name).style.backgroundPosition = "center"
}

async function buildright(levelID) {
    const levelData = await fetchData(levelID)
    build(0, levelData.name, levelData.creator, 0, 0, 0, 0, levelData.nlw_tier, levelData.gddl_tier, levelData.aredl_tier)
    document.getElementById(levelData.name).style.backgroundImage = "url('https://raw.githubusercontent.com/All-Rated-Extreme-Demon-List/Thumbnails/main/levels/full/" + levelID + ".webp')"
    document.getElementById(levelData.name).style.backgroundSize = "cover"
    document.getElementById(levelData.name).style.backgroundPosition = "center"
}




async function order() {

    for (i = 0; i < levels.length; i++) {
        await buildmain(levels[i][0], i)
    }
    for (i = 0; i < inprogress.length; i++) {
        await buildleft(inprogress[i][0], inprogress[i][1])
    }
    for (i = 0; i < bucketlist.length; i++) {
        await buildright(bucketlist[i])
    }
}

function build(placement, name, creator, att, enjoy, worstfail, compdate, nlw, gddl, aredl) {

    const level = document.createElement("div")
    level.setAttribute("class", "level")
    level.setAttribute("id", name)

    const bgwrap = document.createElement("div")
    bgwrap.setAttribute("class", "bgwrap")
    level.append(bgwrap)

    if (att) {

        const infowrap = document.createElement("div")
        infowrap.setAttribute("class", "infowrap")
        bgwrap.append(infowrap)

        const imagewrap = document.createElement("div")
        imagewrap.setAttribute("class", "imagewrap")
        infowrap.append(imagewrap)

        const image = document.createElement("img")
        if (aredl == 1) {
            image.setAttribute("src", "demons/grandpa.png")
        }
        else if (aredl <= 25 && aredl > 1) {
            image.setAttribute("src", "demons/infinite.png")
        }
        else if (aredl <= 75 && aredl > 25) {
            image.setAttribute("src", "demons/mythical.png")
        }
        else if (aredl <= 150 && aredl > 75) {
            image.setAttribute("src", "demons/legendary.png")
        }
        else if (aredl <= 250 && aredl > 150) {
            image.setAttribute("src", "demons/ultimate.png")
        }
        else if (aredl <= 500 && aredl > 250) {
            image.setAttribute("src", "demons/supreme.png")
        }
        else {
            image.setAttribute("src", "demons/extreme.png")
        }
        imagewrap.append(image)

        const difficulties = document.createElement("div")
        difficulties.setAttribute("class", "difficulties")
        infowrap.append(difficulties)

        const difficultiestext = document.createElement("a")
        difficultiestext.innerText = "#" + aredl
        difficulties.append(difficultiestext)

        const br = document.createElement("br")
        difficulties.append(br)

        const difficultiestext2 = document.createElement("a")
        difficultiestext2.innerText = nlw + " | " + gddl
        //id put a check if its listworthy so that it doesnt display null on list demons but im not beating one anyway so im just not doing that loll
        difficultiestext2.setAttribute("class", "diffsmall")
        difficulties.append(difficultiestext2)

        const textwrap = document.createElement("div")
        textwrap.setAttribute("class", "textwrap")
        bgwrap.append(textwrap)

        const levelinfo = document.createElement("h2")
        levelinfo.innerText = "#" + placement + " - " + name + " by " + creator
        textwrap.append(levelinfo)

        const attempts = document.createElement("p")
        attempts.innerText = "Attempts: " + att
        textwrap.append(attempts)

        const enjoyment = document.createElement("p")
        enjoyment.innerText = "Enjoyment: " + enjoy + "/100"
        textwrap.append(enjoyment)

        const fail = document.createElement("p")
        fail.innerText = "Worst Death: " + worstfail + "%"
        textwrap.append(fail)

        const date = document.createElement("div")
        date.setAttribute("class", "date")
        textwrap.append(date)

        const completiondate = document.createElement("p")
        completiondate.innerText = compdate
        date.append(completiondate)

        document.getElementById("main").appendChild(level)
    }

    else if (worstfail) {

        const textwrap = document.createElement("div")
        textwrap.setAttribute("class", "textwrap")
        bgwrap.append(textwrap)

        const levelinfo = document.createElement("h2")
        levelinfo.innerText = "#" + aredl + " | " + name + " by " + creator
        textwrap.append(levelinfo)

        const fail = document.createElement("p")
        fail.setAttribute("class", "runs")
        fail.innerText = "Best Runs: " + worstfail
        textwrap.append(fail)

        document.getElementById("left").appendChild(level)

    }

    else {

        const textwrap = document.createElement("div")
        textwrap.setAttribute("class", "textwrap")
        bgwrap.append(textwrap)

        const levelinfo = document.createElement("h2")
        levelinfo.innerText = "#" + aredl + " | " + name + " by " + creator
        textwrap.append(levelinfo)

        document.getElementById("right").appendChild(level)

    }

}
