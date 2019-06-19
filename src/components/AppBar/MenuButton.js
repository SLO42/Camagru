import React from "react";
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
//import MenuList from '@material-ui/core/MenuList'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import SignOutButton from '../SignOut';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';


  const MyMenuButton = () => (
	  <div>
			<AuthUserContext.Consumer>
				{authUser =>
					authUser ? <MyMenuButtonAuth /> : <MyMenuButtonNonAuth />
				}
			</AuthUserContext.Consumer>
	  </div>
	  );
	
	  
const MyMenuButtonAuth = () => {
	  

		let selectedFile = null;

		const fileChangedHandler = event => {
		  selectedFile = event.target.files[0];
		}

		const uploadHandler = async () => {
  		await console.log(selectedFile)
			}
		return (

		<PopupState variant="popover" popupId="demo-popup-menu">
      		{popupState => (
        	<React.Fragment>
				<IconButton variant="contained" {...bindTrigger(popupState)} edge="start" color="inherit" aria-label="Menu" >
					<MenuIcon />
	  			</IconButton>
          			<Menu {...bindMenu(popupState)}>
					  	<MenuItem onClick={function(event) {popupState.close();}} component={Link} to={ROUTES.CAMERA}>
					  		Camera
						</MenuItem>
						<MenuItem onClick={function(event) {popupState.close();}} component={Link} to={ROUTES.LANDING}>
							Landing
						</MenuItem>
						<MenuItem onClick={function(event) {popupState.close();}} component={Link} to={ROUTES.HOME}>
							Home
						</MenuItem>
						<MenuItem onClick={function(event) {popupState.close();}} component={Link} to={ROUTES.ACCOUNT}>
							Account
						</MenuItem>
						<MenuItem onClick={function(event) {popupState.close();}} component={Link} to={ROUTES.ADMIN}>
							admin
						</MenuItem>
						<MenuItem onClick={function(event) {popupState.close();}}>
							<SignOutButton />
						</MenuItem>
						<MenuItem>Sticker Collection 
						<input type="file" onChange={fileChangedHandler} />
				  		<button onClick={uploadHandler}>Upload!</button>
				  </MenuItem>
          			</Menu>
       		</React.Fragment>
      )}
    	</PopupState>
		);
}

const MyMenuButtonNonAuth = () => {

	return (

	<PopupState variant="popover" popupId="demo-popup-menu">
		  {popupState => (
		<React.Fragment>
			<IconButton variant="contained" {...bindTrigger(popupState)} edge="start" color="inherit" aria-label="Menu" >
				<MenuIcon />
			  </IconButton>
				  <Menu {...bindMenu(popupState)}>
					<MenuItem onClick={function(event) {popupState.close();}} component={Link} to={ROUTES.LANDING}>
						Landing
					</MenuItem>
					<MenuItem onClick={function(event) {popupState.close();}} component={Link} to={ROUTES.SIGN_IN}>
						Sign in
					</MenuItem>
					<MenuItem onClick={function(event) {popupState.close();}} component={Link} to={ROUTES.SIGN_UP}>
						Sign up
					</MenuItem>
				  </Menu>
		   </React.Fragment>
  )}
	</PopupState>
	);
}


export default MyMenuButton;