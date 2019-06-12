import React, { Component } from 'react';
import Webcam from "react-webcam";

export default class MyCamera extends Component{
	constructor (props)
	{
		super(props)
		this.state = {
			photos: [],
			images: []
		}
	}

	setRef = webcam => {
		this.webcam = webcam;
	  };

	capture = async () => {
		let picture = await this.webcam.getScreenshot();
		if (picture === null) {
			console.log("nah"); //not required and to be removed.
			return;
		}
		const now = new Date().toLocaleString();
		console.log(picture);
		let newpic = {
			orignal: picture,
			thumbnail: picture,
			timeStamp: now
		};
		await this.state.photos.push(picture);
		await this.state.images.push(newpic);
		// this.setState({
			// 	iamges: newpic
			// })
		await this.updateCurrent(picture, now);
		await this.setState(this.state);
	  };
	  render() {
		  const videoConstraints = {
			  width: 1920,
			  heigh: 1080,
			  facingMode: "user"
		  };
		  return (
		<div className="Smile" >
			<Webcam
			audio={false}
			height={350}
			ref={this.setRef}
			screenshotFormat="image/jpeg"
			width={350}
			videoConstraints={videoConstraints}
			/>
			<button onClick={this.capture}>Capture photo</button>
		</div>
		  );
	  }
}