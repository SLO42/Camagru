import React, { Component } from 'react';
import Draggable from 'react-draggable';
import ButtonBase from '@material-ui/core/ButtonBase';

import doggo from './image.png';
import './draggable.css'


class DraggableItem extends Component {
	constructor(props){
		super(props);

		this.state ={
			sticker1: 0,
			deltaPostition: {
				x: 0, y: 0
			},

		};
	}

	handleDrag(e, ui) {
		const { x, y } = this.state.deltaPostition;
		this.setState({
			deltaPostition: {
				x: x + ui.deltaX,
				y: y + ui.deltaY,
			}
		});
	}

	updatesticker = () => {

		this.setState({ sticker1: 1 });

	}
	render() {
		const { deltaPostition } = this.state;

		return(
			<div style={{position: "absolute",left: 50, top: 50}}>
				<ButtonBase onClick={this.updatesticker}> yes <img src={doggo} alt={doggo} style={{maxWidth: `100px`}}/> </ButtonBase>
				{this.state.sticker1 ? (
				<Draggable bounds='Smile'>
					<img src={doggo} alt={doggo} style={{maxWidth: `100px`, position: 'relative'}}/>
				</Draggable>) : null }
			</div>

		)
	}
}

export default DraggableItem;



// top right : (-100px, 0px)
// bottom right : (-100px, 237px)

// top left : (-320px, 0px)
// bottom left : (-320px, 327px)