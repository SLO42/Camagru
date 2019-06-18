import React from "react";
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
//import MenuList from '@material-ui/core/MenuList'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ReactDOM from 'react-dom';
import App from './App';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ArrowUpward from '@material-ui/icons/ArrowUpward';


const useStyles = makeStyles({
	list: {
	  width: 250,
	},
	fullList: {
	  width: 'auto',
	},
  });
	  
const MyMenuButton = () => {
	  
		const classes = useStyles();
		const [state, setState] = React.useState({bottom: false });

		let selectedFile = null;

		const fileChangedHandler = event => {
		  selectedFile = event.target.files[0];
		  uploadHandler();
		}

		const uploadHandler = async () => {
  		await console.log(selectedFile)
			}
	
		const toggleDrawer = (side, open) => event => {
			// if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			// 	return;
			// }
		setState({ ...state, [side]: open });
		  };
		  const fullList = side => (
			<div
			  className={classes.fullList}
			  role="presentation"
			  variant="persistent"
			  onClick={toggleDrawer(side, false)}
			  onKeyDown={toggleDrawer(side, false)}
			>
			  <List>
			  	<ListItem button key={"Import transparent sticker"}
				  onClick={() => console.log("test")}>
				  <input type="file" onChange={fileChangedHandler}></input>
				  <button onClick={uploadHandler}>Upload!</button>
					<ListItemIcon>
			  			<ArrowUpward/>
					</ListItemIcon>
		  		</ListItem>
				{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
				  <ListItem button key={text}>
					<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
					<ListItemText primary={text} />
				  </ListItem>
				))}
			  </List>
			</div>
		  );
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
						<MenuItem onClick={toggleDrawer('bottom', true)}>Sticker Collection</MenuItem>
						<Drawer anchor="bottom" open={state.bottom} >
							{fullList('bottom')}
						</Drawer>
          			</Menu>
       		</React.Fragment>
      )}
    	</PopupState>
		);
}

export default withStyles(useStyles)(MyMenuButton);