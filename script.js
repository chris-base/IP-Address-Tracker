import {
	myTokens
} from './tokens.js';

let mymap = L.map('map-container').setView([51, -0], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox/streets-v11',
	tileSize: 512,
	zoomOffset: -1,
	accessToken: myTokens.mapbox_token,
}).addTo(mymap);

const startSearch = e => {

	e.preventDefault();

	const isIP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	const isDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

	const userInput = document.getElementById('search').value;

	if (isIP.test(userInput)) {
		showIPData();
		return;
	} else if (isDomain.test(userInput)) {
		showIPData();
		return;
	}

	document.getElementById('search').style.animation = 'notValidEntry 1s 1';
	document.getElementById('search').addEventListener('webkitAnimationEnd', function () {
		this.style.webkitAnimationName = '';
	}, false);
}

document.getElementById('search-form').addEventListener('submit', startSearch);