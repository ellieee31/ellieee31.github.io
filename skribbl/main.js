let wordList = []
let numbers = []
let check = true

function getwords() {
    let liststr = document.getElementById("list").value
    wordList = liststr.split(", ")
    let amount = document.getElementById("amount").value
    let widthpx = amount * 170
    document.getElementById("words").style.width = widthpx + "px"
    build(amount)
    document.getElementById("wordsleft").textContent = "entries left: " + (wordList.length - numbers.length) + "/" + wordList.length
}

function createword(variable, container) {
    let variablename = variable
    variable = document.createElement('div')
    variable.innerText = numbergen()
    variable.setAttribute("id", variablename)
    variable.setAttribute("class", "words")
    container.appendChild(variable)
}

function numbergen() {
    let check = false
    let num = Math.floor(Math.random() * (wordList.length))
    while (!check) {
        if (!numbers.includes(num)) {
            numbers.push(num)
            check = true
            return wordList[num]
        }
        else {
            if (numbers.length == wordList.length) {
                check = true
                return "no more words left"
            }
            num = Math.floor(Math.random() * (wordList.length))
        }
    }
}


function build(amount) {
    let cntnr = document.createElement('div')
    cntnr.setAttribute("class", "wordcontain")
    for (i = 1; i <= amount; i++) {
        createword("word" + i, cntnr)
    }
    document.getElementById("words").appendChild(cntnr)
}
