// _ = helper functions
let _calculateTimeDistance = (startTime, endTime) => {
	let timeStart = new Date("0001-01-01 " + startTime);
	let timeEnd = new Date("0001-01-01 " + endTime);
	let timeDiff = Math.floor((timeEnd - timeStart) / 1000 / 60);
	return timeDiff;
};

// Deze functie kan een am/pm tijd omzetten naar een 24u tijdsnotatie, deze krijg je dus al. Alsjeblieft, veel plezier ermee.
let _convertTime = t => {
	/* Convert 12 ( am / pm ) naar 24HR */
	let time = new Date("0001-01-01 " + t);
	let formatted = time.getHours() + ":" + ("0" + time.getMinutes()).slice(-2);
	return formatted;
};

// 5 TODO: maak updateSun functie
function updateSun(timeElapsed, totalTime) {

	let percentTime = (timeElapsed / totalTime) * 100;
	if (percentTime < 100) {
		let sunElement = document.querySelector(".js-sun");
		let heightTime = percentTime;
		if (heightTime > 50) {
			heightTime = 100 - heightTime;
		}
		sunElement.style.bottom = `${heightTime*2}%`;
		sunElement.style.left = `${percentTime}%`;
		document.querySelector("html").classList.remove("is-night");
	} else {
		document.querySelector("html").classList.add("is-night");
	}
}
// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {

	let timeLeft = document.querySelector(".js-time-left");
	setInterval(() => {
		var currentDate = new Date();
		var timeElapsed = _calculateTimeDistance(sunrise, currentDate.toLocaleTimeString());
		updateSun(timeElapsed, totalMinutes);
		document.querySelector(".js-sun").setAttribute("data-time", _convertTime(currentDate.toLocaleTimeString()));
		timeLeft.innerHTML = totalMinutes - timeElapsed;
		console.log("Time set");


	}, 60000);

	var currentDate = new Date();
	var timeElapsed = _calculateTimeDistance(sunrise, currentDate.toLocaleTimeString());
	updateSun(timeElapsed, totalMinutes);
	document.querySelector(".js-sun").setAttribute("data-time", _convertTime(currentDate.toLocaleTimeString()));
	timeLeft.innerHTML = totalMinutes - timeElapsed;
	document.querySelector("body").classList.add("is-loaded");

};



// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	let locationElement = document.querySelector(".js-location");
	locationElement.innerHTML = `${queryResponse.location.city}, ${queryResponse.location.country}`;
	let sunriseElement = document.querySelector(".js-sunrise");
	let sunsetElement = document.querySelector(".js-sunset");
	sunriseElement.innerHTML = _convertTime(queryResponse.astronomy.sunrise);
	sunsetElement.innerHTML = _convertTime(queryResponse.astronomy.sunset);
	let timeDiff = _calculateTimeDistance(queryResponse.astronomy.sunrise, queryResponse.astronomy.sunset);
	placeSunAndStartMoving(timeDiff, _convertTime(queryResponse.astronomy.sunrise));
};

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
let getAPI = (lat, lon) => {
	let url = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places where text="(${lat},${lon})")&format=json`;
	fetch(url)
		.then(res => res.json())
		.then(data => showResult(data.query.results.channel));
};

document.addEventListener("DOMContentLoaded", function () {
	// 1 We will query the API with longitude and latitude.
	getAPI(50.8027841, 3.2097454);
});