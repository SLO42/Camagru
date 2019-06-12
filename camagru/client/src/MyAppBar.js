import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import ReactDOM from 'react-dom';
import Signin from './signin.js';
import { purple } from '@material-ui/core/colors';
import { createMuiTheme, makeStyles} from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import MyMenuButton from './MenuButton.js';

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

function SwitchToLogin() {
	ReactDOM.render(<Signin />, document.getElementById('root'));
}

function ButtonAppBar() {
	const classes = useStyles();
  return (
	  <div className={classes.root}>
	<ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
		<MyMenuButton />
          <Typography variant="h6" className={classes.title}>
            <marquee>Camagru by Saolivei</marquee> {/* eslint-disable-line */}
          </Typography>
          <ButtonBase color="inherit" onClick={SwitchToLogin}>Login</ButtonBase>
        </Toolbar>
      </AppBar>
	  </ThemeProvider>
    </div>
  );
}
export default ButtonAppBar;