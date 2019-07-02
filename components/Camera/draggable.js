import React, { Component } from 'react';
import Draggable from 'react-draggable';


class DraggableItem extends Component {
	constructor(props){
		super(props);

		this.state ={
			activeDrags: 0,
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

	onStart() {
		this.setState({activeDrags: ++this.state.activeDrags});
	}

	onStop() {
		this.setState({activeDrags: --this.state.activeDrags});
	}

	render() {
		const dragHandlers = {onStart: this.onStart, onStop: this.onStop};
		const { deltaPostition } = this.state;

		return(
			<div>
				<Draggable bounds={this.props.bounds} {...dragHandlers}>
					<div>
						<img src={"https://imgur.com/a/EQb401n"} alt={"https://imgur.com/a/EQb401n"}/>
					</div>
				</Draggable>
			</div>

		)
	}
}

export default DraggableItem;