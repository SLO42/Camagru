import React from 'react';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import App from './App.js';
// import { makeStyles } from '@material-ui/core/styles';
// import GridList from '@material-ui/core/GridList';
// import GridListTile from '@material-ui/core/GridListTile';
// import GridListTileBar from '@material-ui/core/GridListTileBar';
// import IconButton from '@material-ui/core/IconButton';
// import StarBorderIcon from '@material-ui/icons/StarBorder';

// const useStyles = makeStyles(theme => ({
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around',
//     overflow: 'hidden',
//     backgroundColor: theme.palette.background.paper,
//   },
//   gridList: {
//     flexWrap: 'nowrap',
//     // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
//     transform: 'translateZ(0)',
//   },
//   title: {
//     color: theme.palette.primary.light,
//   },
//   titleBar: {
//     background:
//       'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
//   },
// }));

// /**
//  * The example data is structured as follows:
//  *
//  * import image from 'path/to/image.jpg';
//  * [etc...]
//  *
//  * const tileData = [
//  *   {
//  *     img: image,
//  *     title: 'Image',
//  *     author: 'author',
//  *   },
//  *   {
//  *     [etc...]
//  *   },
//  * ];
//  */
export default class ImgList extends React.Component {

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
			images: props.images
		}
	}
	
	async onSlideEvent(event) {
		const app = new App();
		await this.setState({
			selected: event,
			selectedTime: this.state.images[event].timeStamp,
			currentPic: await this.state.photos[event]
		})
		app.updateCurrent(this.state.currentPic, this.state.selectedTime);
		console.log(event)

	}

render () {

	return (
		<div>
		<ImageGallery
				ref={i => this._imageGallery = i}
				// onThumbnailClick={this._onThumbnailClick.bind(this)}
				items={this.state.images} 
				infinite={this.state.infinite}
				showBullets={this.state.showBullets}
				// onClick={this._onImageClick.bind(this)}
				showNav={this.state.showNav}
				showIndex={this.state.showIndex}
				slideOnThumbnailOver={this.state.slideOnThumbnailOver}
				thumbnailPosition={this.state.thumbnailPosition}
				showPlayButton={this.state.showPlayButton}
				showGalleryFullscreenButton={this.state.showGalleryFullscreenButton}
				showFullscreenButton={this.state.showFullscreenButton}
				additionalClass="app-image-gallery"
				onSlide={this.onSlideEvent.bind(this)}
				/>
		</div>
	);
	};
}