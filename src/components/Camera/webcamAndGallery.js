import React from 'react';
import Webcam from "react-webcam";
import ImageGallery from 'react-image-gallery';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ImageCard from './imageCard.js';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { compose } from 'recompose';
//import DraggableItem from './draggable';
import Draggable from 'react-draggable';
import ButtonBase from '@material-ui/core/ButtonBase';
import mergeImages from 'merge-images';

import doggo from './stickers/doggo64.png';
import cataxe from './stickers/cataxe64.png';
import './draggable.css'

import { withFirebase } from '../Firebase';
import { withAuthorization, AuthUserContext } from '../Session';
import "react-image-gallery/styles/css/image-gallery.css";


class MyCamera extends React.Component{
	constructor (props)
	{
		super(props)
		this.state = {
			showIndex: false,
			showBullets: false,
			infinite: true,
			showThumbnails: true,
			showFullscreenButton: false,
			showGalleryFullscreenButton: false,
			showNav: false,
			slideOnThumbnailOver: false,
			showPlayButton: false,
			thumbnailPosition: 'bottom',
			images: [],

			selected: -1,
			total: -1,
			selectedTime: null,
			currentPic: null,

			photos: [],
			saved: [],
			loading: false,

			selectedSticker: null,
			sticker: 0,
			stickerPos: {
				x: 0,
				y: 0,
			},

			handleLike: async ( src, toc, selected, authUser ) => {
				const iId = toc.replace(/\//g, '-').replace(/PM|AM/g, '') + authUser.uid.slice(0-7);
				if (this.state.images[selected].liked === false)
				{
					const imgobj = {
						src,
						toc,
						selected,
						liked: true
					}
					const newimg = {
						iid: iId,
						title: window.prompt("Enter a title for your new image", iId),
						src,
						toc,
						likes: 1,
						comments: [{
							text: window.prompt("Enter a Description", "Whaterver you want <3"),
							userId: authUser.uid,
							time: new Date().toLocaleString() 
						},],
					}
					await this.state.saved.push(imgobj)
					this.state.images[selected].liked = true;
					this.props.firebase
						.doAddLiked(newimg);
					await this.setState(this.state)
					return (imgobj);
				}
				else {
					this.props.firebase.doRemoveLiked(iId);
					for (let i in this.state.saved) {
						if (this.state.selected === this.state.saved[i].selected) {
							await delete this.state.saved[i];
							let saved = await this.state.saved.filter((el) => {
								return el != null;
							})
							this.state.images[selected].liked = false;
							await this.setState({
								saved
							})
							break;
						}
					}
				}
				return null;
			}
		}
	}

	componentDidMount() {
		this.setState({ loading: true });
		}

	componentWillUnmount() {
		this.props.firebase.gallery().off();
	}


	async onSlideEvent(event) {
		await this.setState({
			selected: event,
			selectedTime: this.state.images[event].timeStamp,
			currentPic: await this.state.photos[event]
		})
	}

	async updateCurrent(pic, now) {
		await this.setState({
			currentPic: pic,
			selectedTime: now,
			total: this.state.total + 1,
		})
		await this.setState({
			selected: this.state.total
		})
	}

	setRef = webcam => {
		this.webcam = webcam;
	  };
	
	setRef2 = imageGallery => {
		this._imageGallery = imageGallery;
	}

	updatesticker = stick => {
		this.setState({ 
			sticker: 1,
			selectedSticker: stick,
		
		});
	}

	capture = async () => {
		let picture = await this.webcam.getScreenshot();
		if (picture === null) {
			return;
		}

		const getCurrentState = () => {
			if (document.getElementById("imagine")){
				const info = document.getElementById("imagine").getAttribute("style");
				let values = (info.slice(info.indexOf("(") + 1, info.indexOf(")")));
				return this.CSV_to_JSON('x,y|'+ values);
			}
		}

		const merger = async ( picture, stickerObj ) => {
			if (picture && stickerObj){
					const x = parseInt(stickerObj[0].x);
					const y = parseInt(stickerObj[0].y);

					await mergeImages([
						{ src: picture, x: 0, y: 0},
						{ src: this.state.selectedSticker, x, y }
					]).then(b64 => this.setState({ currentPic: b64 }));
				}

			}

		await merger(picture, getCurrentState());
		picture = this.state.currentPic;

		const now = new Date().toLocaleString();
		let newpic = {
			orignal: picture,
			thumbnail: picture,
			timeStamp: now,
			liked: false
		};
		await this.state.photos.push(picture);
		await this.state.images.push(newpic);
		// this.setState({
			// 	iamges: newpic
			// })
		await this.updateCurrent(picture, now);
		await this.setState(this.state);
	  };

	CSV_to_JSON = (data, delimiter = ',') => {
		const titles = data.slice(0, data.indexOf('|')).split(delimiter);
		return data
			.slice(data.indexOf('|') + 1)
			.split('|')
			.map(v => {
			const values = v.split(delimiter);
			return titles.reduce((obj, title, index) => ((obj[title] = values[index]), obj), {});
		});
	};

	isAble = () => {
		if (this.state.sticker){
			if (document.getElementById("imagine")){
				if (this.state.sticker === 1) {
					this.setState({ sticker: 2 });
				}
				return (1);
			} else return (0);
		} else return (0);
	}

	  render() {
		const videoConstraints = {
			  width: 720,
			  heigh: 640,
			  facingMode: "user"
		  };
		const {sticker, images, infinite, showBullets,
			showNav, showIndex, slideOnThumbnailOver, thumbnailPosition,
			showPlayButton, showGalleryFullscreenButton, showFullscreenButton,
			selectedSticker
		} = this.state;

		  return (
			  <AuthUserContext.Consumer>
				  {authUser => (
				<div className="MyCameraStart" style={{position: 'relative'}}>
					<div className="Smile" style={{width: 320, height: 220, display: 'flex', justifyContent: 'inherit'}}>
						<Webcam
						audio={false}
						height={220}
						ref={this.setRef}
						screenshotFormat="image/jpeg"
						width={320}
						videoConstraints={videoConstraints}
						/>
						{selectedSticker ? (
							<Draggable bounds='parent' onStop={this.isAble} >
								<img id="imagine" src={selectedSticker} alt={selectedSticker} style={{position: 'absolute', top: 18}}/>
							</Draggable>) : null }

					{/* <DraggableItem /> */}
					</div>
					<ButtonBase onClick={() => this.updatesticker(cataxe)}> yes <img src={cataxe} alt={cataxe} style={{maxWidth: `100px`}}/> </ButtonBase>
					<ButtonBase onClick={() => this.updatesticker(doggo)}> yes <img src={doggo} alt={doggo} style={{maxWidth: `100px`}}/> </ButtonBase>
					<div style={{margin: 'auto', alignContent: 'center'}}>
						<button disabled={sticker === 1 || sticker === 0} onClick={this.capture}>Capture photo</button>
					</div>
					<div className="Gallery" style={{
						maxWidth: '750px',
						whiteSpace: 'auto',
						margin: 'auto',
					}}>
						<ExpansionPanel TransitionProps={{ unmountOnExit: true }} 
							style={{ backgroundColor: 'skyblue'}}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="pnel1a-header"
							>Recent Gallery
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Container >
									<Grid container
										direction="column"
										justify="center"
										alignItems="center"
									>
										<Grid item style={{maxWidth: '658px'}}>
											<ImageGallery
												ref={this.setRef2}
												// onThumbnailClick={this._onThumbnailClick.bind(this)}
												items={images} 
												infinite={infinite}
												showBullets={showBullets}
												// onClick={this._onImageClick.bind(this)}
												showNav={showNav}
												showIndex={showIndex}
												slideOnThumbnailOver={slideOnThumbnailOver}
												thumbnailPosition={thumbnailPosition}
												showPlayButton={showPlayButton}
												showGalleryFullscreenButton={showGalleryFullscreenButton}
												showFullscreenButton={showFullscreenButton}
												additionalClass="app-image-gallery"
												onSlide={this.onSlideEvent.bind(this)}
												disableSwipe={true}
											/>
										</Grid>
										<Grid item >
											<ImageCard 
												src={!this.state.currentPic ? null : this.state.currentPic}
												timeStamp={this.state.selectedTime}
												selected={this.state.selected}
												liked={this.state.selected === -1 ? null : this.state.images[this.state.selected].liked }
												handleLike={this.state.handleLike}
												authUser={authUser}
											/>
										</Grid>
									</Grid>
								</Container>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</div>
				</div>
				)}
				</AuthUserContext.Consumer>
		  	);
	 	 }
}

const condition = authUser => !!authUser;



export default compose(
	withFirebase,
	withAuthorization(condition),
)(MyCamera);