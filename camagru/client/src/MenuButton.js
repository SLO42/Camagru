import React, { Component } from "react";
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
//import MenuList from '@material-ui/core/MenuList'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ReactDOM from 'react-dom';
import App from './App';

export default class MyMenuButton extends Component{
	constructor (props){ {/* eslint-disable-line */}
		super(props);
}
	// fix the renders to the appropriate pages, client side rendering for easy
	render(){
		return (		
		<PopupState variant="popover" popupId="demo-popup-menu">
      {popupState => (
        <React.Fragment>
			<IconButton variant="contained" {...bindTrigger(popupState)} edge="start" color="inherit" aria-label="Menu" >
		<MenuIcon />
	  </IconButton>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={function(event) {popupState.close(); ReactDOM.render(<App />, document.getElementById('root'));}}>Camera</MenuItem>
            <MenuItem onClick={function(event) {popupState.close(); ReactDOM.render(<App />, document.getElementById('root'));}}>Account Info</MenuItem>
			<MenuItem onClick={function(event) {popupState.close(); ReactDOM.render(<App />, document.getElementById('root'));}}>Complete Gallery</MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
		);
	};
}