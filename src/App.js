import React, { Component } from 'react';
import './App.css';
import Grid from '@material-ui/core/Grid';
import MyCamera from './Camera';

// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import ImageGallery from 'react-image-gallery';

// {/* apply to over x and allow no wrap for the unbound box, 
// 	or create a new grid layout that incorporates the 
// 	new format, whichever you really wanna do at this point. Gridlist is not allowing me to do more 
// 	than apply multiple lists of grids, when i want just the one list.
// 	replace gridlist with react-image-gallery for better presentation
// */}
// 	{/* <GridList cols={4} styel={{ flexWrap: 'nowrap', transform: 'translateY(0)', cellHeight: 'auto', wrap: 'nowrap'}}>
// 	{this.state.photos.map(tile => (
// 		<GridListTile key={tile}>
// 		<img src={tile} alt={tile} />
// 		<GridListTileBar style={{
// 			background:
// 			'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
// 		}}
// 		title={tile}
// 		actionIcon={
// 			<IconButton aria-label={`star ${tile}`}>
// 			<StarBorderIcon />
// 			</IconButton>
// 		}
// 		/>
// 		</GridListTile>
// 		))}
// 	</GridList> */}
// 	{/* <Register email="11sosam11@gmail.com"></Register> */}
//   {/* <h2>Currently Selected</h2> */}


class App extends Component {

	constructor (props)
	{
		super(props)
		this.state = {
			users: []
		};
		this.preconditionFetch();
	};

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
	
	

	// getCurrentInfo(){

	// 	if (this.state.images.timeStamp === null) return null;
	//  return this.state.images.timeStamp;
	// }

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
		return (
			<div className="App" style={{ flexGrow: 1 }}>
				<div className="Paper" style={{ 
				margin: 'auto',
				
				}}>
						<Grid container justify="center">
							<Grid container item md={'auto'} justify='center'>
						<MyCamera />
					</Grid>
	  {/* <img src={this.state.currentPic} alt={this.state.currentPic} /> */}
      					</Grid>
				</div>
			</div>
    	);
	}
	};
export default App;