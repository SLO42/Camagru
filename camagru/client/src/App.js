import React, { Component } from 'react';
import ImageCard from './imageCard.js';
import ImgList from './GridList.js';
import './App.css';
import Webcam from "react-webcam";
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "react-image-gallery/styles/css/image-gallery.css";

export default class App extends Component {

	constructor (props)
	{
		super(props)
		this.state = {
			showIndex: false,
			showBullets: true,
			infinite: true,
			showThumbnails: true,
			showFullscreenButton: false,
			showGalleryFullscreenButton: false,
			showNav: false,
			slideOnThumbnailOver: false,
			showPlayButton: false,
			thumbnailPosition: 'bottom',
			selected: null,
			selectedTime: null,
			currentPic: null,
			users: [],
			photos: [],
			saved: [],
			images: []
		};
		this.preconditionFetch();
	};

	async handleLike() {
		const imgobj = {
			src: this.state.currentPic,
			toc: this.state.selectedTime
		}
		await this.state.saved.push(imgobj);
		await this.setState(this.state);	
	}
	async onSlideEvent(event) {
		await this.setState({
			selected: event,
			selectedTime: this.state.images[event].timeStamp,
			currentPic: await this.state.photos[event]
		})
		console.log(event)
	}

	// async _onImageClick(event) {
	// 	await this.setState({
	// 		selected: this._imageGallery.getCurrentIndex(),
	// 		currentPic: await this.state.photos[this.state.selected]
	// 	})
	// };

	// async _onThumbnailClick(event) {
	// 	await this.setState({
	// 		selected: await this._imageGallery.getCurrentIndex(),
	// 		currentPic: await this.state.photos[this.state.selected]
	// 	})
	// 	let currentpic = await this.state.photos[this.state.selected];
	// 	await this.updateCurrent(currentpic);
	// }
	
	
	setRef = webcam => {
		this.webcam = webcam;
	  };

	async updateCurrent(pic, now) {
		await this.setState({
			currentPic: pic,
			selectedTime: now
		})
	}

	// getCurrentInfo(){

	// 	if (this.state.images.timeStamp === null) return null;
	//  return this.state.images.timeStamp;
	// }

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

	state = {users: []}
	status(response) {
		if (response.status >= 200 && response.status < 300){
			return Promise.resolve(response)
		} else {
			return Promise.reject(new Error(response.statusText))
		}
	};
	json(response) {
		return response.json()
	};

	preconditionFetch = async () => this.setState({ users: await (await fetch('/users')).json()});

	// async preconditionFetch() {

	// 	const response = await fetch('/users');
	// 	const users = await response.json();
	// 	// if everything ok convert to json

	// 	this.setState({ users });
	// }

	// componentDidUpdate(prevProps, prevState) {
	// 	if (this.state.slideInterval !== prevState.slideInterval ||
	// 		this.state.slideDuration !== prevState.slideDuration) {
	// 	  // refresh setInterval
	// 	  this._imageGallery.pause();
	// 	  this._imageGallery.play();
	// 	}}
	
	render() {
		const videoConstraints = {
			width: 1280,
			height: 720,
			facingMode: "user"
		  };
		return (
			<div className="App" style={{ flexGrow: 1 }}>
			<div className="Paper" style={{ 
				margin: 'auto',
				
				}}>
		<Grid container spacing={2}>
			<Grid container justify="center">
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
				</Grid>
				<Grid container item md={'auto'} justify='flex-end'>
			<div style={{
				maxWidth: '750px',
				whiteSpace: 'auto',
				margin: 'auto',
			}}>
			<ExpansionPanel TransitionProps={{ unmountOnExit: true }} >
				<ExpansionPanelSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="pnel1a-header"
				>Recent Gallery
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
			<ImgList images={this.state.images}
				/>
				</ExpansionPanelDetails>
				</ExpansionPanel>
			</div>
				</Grid>
		</Grid>
		{/* apply to over x and allow no wrap for the unbound box, 
		or create a new grid layout that incorporates the 
		new format, whichever you really wanna do at this point. Gridlist is not allowing me to do more 
		than apply multiple lists of grids, when i want just the one list.
		replace gridlist with react-image-gallery for better presentation
	*/}
		{/* <GridList cols={4} styel={{ flexWrap: 'nowrap', transform: 'translateY(0)', cellHeight: 'auto', wrap: 'nowrap'}}>
        {this.state.photos.map(tile => (
			<GridListTile key={tile}>
            <img src={tile} alt={tile} />
            <GridListTileBar style={{
				background:
				'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
			}}
			title={tile}
			actionIcon={
				<IconButton aria-label={`star ${tile}`}>
				<StarBorderIcon />
                </IconButton>
			}
			/>
			</GridListTile>
			))}
		</GridList> */}
		{/* <Register email="11sosam11@gmail.com"></Register> */}
	  {/* <h2>Currently Selected</h2> */}
	  <ImageCard 
	  src={!this.state.currentPic ? null : this.state.currentPic}
	  timeStamp={this.state.selectedTime}
	  handleLike={this._handleLike}
	  />
	  {/* <img src={this.state.currentPic} alt={this.state.currentPic} /> */}
      </div>
		</div>
    	);
	}
	};
