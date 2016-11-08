`use strict`;

const title = document.createElement(`h1`);
title.textContent = `Life is Short. Don't Waste It.`;
title.id = `title`;
document.getElementById(`top`).appendChild(title);

const pic = document.createElement(`img`);
pic.id = `pic`;
pic.src = `ferris.jpg`;
pic.width = `420`;
document.getElementById(`top`).appendChild(pic);

const allbtns = document.createElement(`div`);
allbtns.id = `allbtns`
document.getElementById(`nav`).appendChild(allbtns);

const makeButtons = (array) => {
    for (let i = 0; i < array.length; i++) {
        const btnCreated = document.createElement(`button`);
        btnCreated.textContent = array[i][1];
        btnCreated.className = `btn`;
        btnCreated.id = array[i][0];
        btnCreated.addEventListener(`click`, (e) => {
            if (document.getElementById(`loading`)) document.getElementById(`loading`).remove();
            if (document.getElementById(`places`)) document.getElementById(`places`).remove();
            const loading = document.createElement(`p`);
            loading.id = `loading`;
            loading.textContent = `⏱ Downloading data...`;
            document.getElementById(`main`).appendChild(loading);
            const xmlhttp = new XMLHttpRequest();
            xmlhttp.open(`POST`, `/${array[i][0]}`);
            xmlhttp.setRequestHeader("Content-type", "text/html");
            xmlhttp.onload = () => { showPlaces(JSON.parse(xmlhttp.responseText)) };
            xmlhttp.send();
            const allButtons = document.getElementsByClassName(`btn`);
            const abLength = allButtons.length;
            for (let i = 0; i < abLength; i++) allButtons[i].className = `btn`
            btnCreated.className = `btn btnselected`;
            // Not choosing to use GPS location due to small radius of Factual.com API search
            // console.log("Retrieving location from Google Maps API to send...");
            // navigator.geolocation.getCurrentPosition(sendPosition, error);
        });
        document.getElementById(`allbtns`).appendChild(btnCreated);
    }
}

makeButtons([
    [`firstdate`, `First Date`],
    [`seconddate`, `Second Date`],
    [`thirddate`, `Third Date`],
    [`fourthdate`, `Fourth Date`],
    [`fifthdate`, `Fifth Date`],
    [`goingwell`, `Date Going Well`],
    [`meat`, `Craving Meat`],
    [`nomeat`, `Craving Veggies`],
    [`largegroup`, `Large Group`],
    [`nightout`, `Night Out`],
    [`learn`, `Learn`],
    [`allday`, `All Day Experience`],
    [`nogoingback`, `No Going Back`],
    [`nature`, `Nature`],
    [`sweettooth`, `Sweet Tooth`]
]);

const sendPosition = (pos) => {
    const lat = pos.coords.latitude;
    const long = pos.coords.longitutde;
    console.log(`Location obtained from Google Maps API. Sending position object: ${pos}`)
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open(`POST`, { url: `/firstdate`, lat: lat, long: long });
    xmlhttp.setRequestHeader(`Content-type`, `application/json`);
    xmlhttp.onLoad = (results) => { showPlaces(results) }
    xmlhttp.send();
}

const error = (err) => { console.error(`ERROR getting geolocation (Code ${err.code} ): ${err.message}`) };

const showPlaces = (results) => {
    if (loading = document.getElementById(`loading`)) loading.remove();
    if (places = document.getElementById(`places`)) places.remove();
    const placesDiv = document.createElement(`div`);
    placesDiv.id = `places`;
    results.forEach(pair => {
        const entry = document.createElement(`p`);
        const desc = document.createElement(`span`);
        desc.className = `desc`;
        desc.textContent = pair[1];
        entry.appendChild(desc);
        entry.innerHTML += `<br>`;
        const name = document.createElement(`span`);
        name.className = `name`;
        name.textContent = pair[0].name;
        entry.appendChild(name);
        if (pair[0].neighborhood) {
            entry.innerHTML += ` in `;
            const neighborhood = document.createElement(`span`);
            neighborhood.className = `neighborhood`;
            neighborhood.textContent = pair[0].neighborhood[0];
            entry.appendChild(neighborhood);
        }
        entry.innerHTML += `<br>`;
        const address = document.createElement(`span`);
        address.className = `address`;
        address.textContent = `${pair[0].address}, ${pair[0].locality}, ${pair[0].region} ${pair[0].postcode}`;
        entry.appendChild(address);
        placesDiv.appendChild(entry);
        document.getElementById(`main`).appendChild(placesDiv);
    });
}