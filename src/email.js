import React from 'react';


const hash = require('object-hash');
// var config = {
// 	apiKey: "AIzaSyD3xpYsNav8BKgcPZvAKiQlAk_phxJTAng",
// 	authDomain: "camagru-42-saolivei.firebaseapp.com",
// 	databaseURL: "https://camagru-42-saolivei.firebaseio.com/",
// 	storageBucket: "gs://camagru-42-saolivei.appspot.com/"
// };


//var token = '1fee2c6a-f0ed-413a-a59e-59dfae6ba88b';
//user: "ses-smtp-user.20190502-184203",
//var gmailtoken = 'wltrotjnvmgelhlu';


export default class Register extends React.Component {
	constructor(props) {
		super(props);
		
		this.updateEmail = this.updateEmail.bind(this);
		this.updatePass = this.updatePass.bind(this);
		this.submit = this.submit.bind(this);
		this.generatePin = this.generatePin.bind(this);
		this.generate = this.generate.bind(this);
		this.state = {
			email: '',
			pw: '',
			pin: '',
			v: false
		};
	}
	generate(n) {
		var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
		
        if ( n > max ) {
			return this.generate(max) + this.generate(n - max);
		}
		
        max        = Math.pow(10, n+add);
        var min    = max/10; // Math.pow(10, n) basically
        var number = Math.floor( Math.random() * (max - min + 1) ) + min;
		
        return ("" + number).substring(add); 
	};
	updateEmail(event) {
		this.setState({
			email: event.target.value,
		})
	};
	
	updatePass(event) {
		this.setState({
			pw: hash(event.target.value, {algorithm: 'whirlpool', encoding: 'base64'}),
		});
	};
	
	generatePin() {
		this.setState({
			pin: this.generate(6),
		});
	};

	
	
	async submit() {
		
	};
	render() {
		return(
			<div>
				<title>Camagru Verify</title>
				<form onClick={this.generatePin} onSubmit={this.submit}>
					<label>Email:
					<input type="text" value={this.state.email} onChange={this.updateEmail} />
					</label>
					<input type="submit" value="Submit"/>
				</form>
			</div>
	)};
}