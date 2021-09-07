import {
	myTokens
} from './tokens.js';

let mymap = L.map('map-container').setView([51.5, -0.09], 2);
const getURL = (ipOrDomain, userInput) => `https://geo.ipify.org/api/v1?apiKey=${myTokens.ip_geo_key}&${ipOrDomain}=${userInput}`;

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox/streets-v11',
	tileSize: 512,
	zoomOffset: -1,
	accessToken: myTokens.mapbox_token,
}).addTo(mymap);

const startSearch = e => {

	document.getElementById('show-user-ip-button').style.display = 'none';

	e.preventDefault();

	const isIP = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	const isDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

	const userInput = document.getElementById('search').value;

	if (isIP.test(userInput)) {
		fetchData('ipAddress', userInput)
			.then(results => showIPData(results))
			.catch(console.error());
		return;
	} else if (isDomain.test(userInput)) {
		fetchData('domain', userInput)
			.then(results => showIPData(results))
			.catch(console.error());
		return;
	}

	document.getElementById('search').style.animation = 'notValidEntry 1s 1';
	document.getElementById('search').addEventListener('webkitAnimationEnd', function () {
		this.style.webkitAnimationName = '';
	}, false);
}

document.getElementById('search-form').addEventListener('submit', startSearch);

const fetchData = async (ipOrDomain, userInput) => {

	let response = await fetch(getURL(ipOrDomain, userInput));
	let json = await response.json();

	console.log(await json);

	return {
		ip: json['ip'],
		ipLocation: `${json['location']['city']}, ${json['location']['region']} ${json['location']['postalCode']}`,
		ipTimezone: `UTC${json['location']['timezone']}`,
		ipISP: `${json['isp']}`,
		latAndLong: [json['location']['lat'], json['location']['lng']],
	}

}

const showIPData = (results) => {

	document.getElementById('ip-address-text').innerHTML = results.ip;
	document.getElementById('ip-location-text').innerHTML = results.ipLocation;
	document.getElementById('ip-timezone-text').innerHTML = results.ipTimezone;
	document.getElementById('ip-isp-text').innerHTML = results.ipISP;

	mymap.setView(results.latAndLong, 15);
	L.marker(results.latAndLong).addTo(mymap);

}

const getUserIP = async () => {

	document.getElementById('show-user-ip-button').style.display = 'none';

	let response = await fetch('https://api.ipify.org?format=json');
	let json = await response.json();

	document.getElementById('search').value = json.ip;
	document.getElementById('submit').click();

}

document.getElementById('show-user-ip-button').addEventListener('click', getUserIP);