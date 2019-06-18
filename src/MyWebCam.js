import React from "react";
import Webcam from "react-webcam";
 
export default class MyWebCam extends React.Component {
 setRef = webcam => {
    this.webcam = webcam;
  };
 
  capture = () => {
	const imageSrc = this.webcam.getScreenshot();
  };
 
  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };
 
    return (
      <div>
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