wordList = ["dingle", "shaker", "box", "purple button", "switch", "door", "kijetesantakalu", "steamed hams", "this guy got hit by shotgun", "i shot personal in butt", "airport jabort", "SOLO 14", "idk what to tell yall bro", "Level 00", "Level 01", "Level 02", "Level 03", "Level 04", "Level 05", "Level 06", "Level 07", "Level 08", "Level 09", "Level 10", "Level 11", "Level 12", "Level 13", "Level 14", "Level 15", "Level 16", "Level 17", "Level 18", "Level 19", "Level 20", "Level 21", "Level 22", "Level 23", "Level 24", "Level 25", "Level 26", "Level 27", "Level 28", "Level 29", "buffalo wild wings", "hold up his writing is this fire?!", "jan Tokotoko", "toki poner", "tenpo", "feverse fextended fyper", "swoosted fuper", "koosted ultra", "koosted hyper funnyhop", "pea wojak", "shaked hands", "celeste cat", "madeline", "feetshakes", "boykisser", "despair", "mpreg", "bluemoji", "john h backlight", "thick of it", "grandpa demon", "rodent uses optimal pathing", "retention tech", "chinese jpegmafia", "marek leja", "do you want some of this on your that", "british indian ocean territory", "united states minor outlying islands", "truth or dare", "ladonia", "bikini atoll", "pumber", "geezer gaming", "polynomial dingle", "pearto", "9 factorial squared", "jev", "jeet yet", "gregregation", "habibi squad", "absolute cinema", "wawa!!!!!!!", "the royal game of ur", "rule 86 no thomas echnical", "chumai", "minesweeper", "clarence", "amalgam", "true...", "crispy fries", "eye of ra", "smooth papi", "chicken jockey", "flula", "opole", "wroclaw", "ithkuil", "whatsapp gordon freeman", "hawktober", "loud incorrect buzzer", "gary ends the season with a banger", "tienes 14? activa cam", "aplle", "ko laso o moli", "middle paw", "paws up", "co taki grzybny", "mi tawa e tomo", "markiplier"]

numbers = []

function getwords() {
    createword("word1")
    createword("word2")
    createword("word3")
}

function createword(variable) {
    variable = document.createElement('div')
    variable.innerText = numbergen()
    variable.setAttribute("id", variable)
    variable.setAttribute("class", "words")
    document.getElementById("words").appendChild(variable)
}

function numbergen() {
    check = false
    let num = Math.floor(Math.random() * (wordList.length))
    while (!check) {
        if (!numbers.includes(num)) {
            numbers.push(num)
            check = true
            return wordList[num]
        }
        else {
            if(numbers.length == wordList.length){
                check = true
                return "no more words left"
            }
            num = Math.floor(Math.random() * (wordList.length))
        }
    }
}
