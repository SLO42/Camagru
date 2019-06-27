import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//import Button from '@material-ui/core/Button';
import { purple } from '@material-ui/core/colors';
import { createMuiTheme, makeStyles} from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import MyMenuButton from './MenuButton.js';
import { AuthUserContext } from '../Session';


const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));
var theme = createMuiTheme({
	palette: {
		primary: {
			main: '#ab47bc',
		},
		secondary: purple,
	},
});

function MyAppBar() {
	const classes = useStyles();
  return (
	<AuthUserContext.Consumer>
		{authUser => (
			<AuthUserContext.Provider value={authUser} >
				<div className={classes.root}>
					<ThemeProvider theme={theme}>
						<AppBar position="static">
							<Toolbar>
							<MyMenuButton/>
							<Typography variant="h6" className={classes.title}>
								<marquee>Camagru by Saolivei</marquee> {/* eslint-disable-line */}
							</Typography>
							</Toolbar>
						</AppBar>
					</ThemeProvider>
				</div>
		</AuthUserContext.Provider>)

		}
	</AuthUserContext.Consumer>
  );
}
export default MyAppBar;