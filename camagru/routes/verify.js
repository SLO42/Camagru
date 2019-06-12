var express = require('express');
var router = express.Router();

router.options('/', function (req, rep, next) {
	var xhttp = new XMLHttpRequest();
		var url =  "https://api.emailjs.com/api/v1.0/email/send";
		xhttp.open("OPTIONS", url, true);
		xhttp.send();
		var body = '<?xml version "1.0"?><person><name>Arun></name></person>';
		console.log (xhttp.getAllResponseHeaders());
		if (xhttp) {
			xhttp.open('POST', url, true);
			xhttp.setRequestHeader('X-PINGOTHER', 'pingpong');
			xhttp.onreadystatechange = 1;
			xhttp.send(body);
		}
		var param = {
			to_name: this.state.email,
			pin: this.state.pin
		};
		emailjs.send('default_service', 'Camagru', param)
			.then(function(response) {
				console.log('SUCCESS!', response.status, response.text);
			}, function(error) {
				console.log('FAILED...', error);
			});
});