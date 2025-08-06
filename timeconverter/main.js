function convert() {
    from = document.getElementById('from').value
    to = document.getElementById('to').value
    time = (document.getElementById('days').value) * 86400 + (document.getElementById('hours').value) * 3600 + (document.getElementById('minutes').value) * 60 + document.getElementById('seconds').value

    if (from == "stardewvalleylol") {
        from = 3600 / 43
    }
    else if (to == "stardewvalleylol") {
        to = 43 / 3600
    }

    convertedtime = to / from * time
    result = Math.floor(convertedtime / 86400) + " days, " +
    (Math.floor(convertedtime / 3600) - Math.floor(convertedtime / 86400) * 24) + " hours, " +
    (Math.floor(convertedtime / 60) - Math.floor(convertedtime / 3600) * 60) + " minutes, " +
    (convertedtime - Math.floor(convertedtime / 60) * 60) + " seconds"

    document.getElementById('result').textContent = result

    console.log(from, to, time)
    console.log(to / from * time)
}