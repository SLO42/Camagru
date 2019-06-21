import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';


class SignInWithFacebookBase extends Component {
	constructor(props){
		super(props);

		this.state = { error: null };
	}

	onSubmit = event => {
		this.props.firebase
			.doSignInWithFacebook()
			.then(socialAuthUser => {
				return this.props.firebase
					.user(socialAuthUser.user.uid)
					.set({
						username: socialAuthUser.additionalUserInfo.profile.email,
						email: socialAuthUser.additionalUserInfo.profile.email,
						roles: {},
					});
				})
			.then(() => {
				this.setState({ error: null });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				this.setState({ error });
			});

			event.preventDefault();
	};

	render() {
		const { error } = this.state;

		return (
			<form onSubmit={this.onSubmit}>
				<Button type="submit">Sign In with Facebook</Button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

class SignInWithGoogleBase extends Component {
	constructor(props) {
		super(props)
		
		this.state = { error: null };
	}

	onSubmit = event => {
		this.props.firebase
			.doSignInWithGoogle()
			.then(socialAuthUser => {
				return this.props.firebase
					.user(socialAuthUser.user.uid)
					.set({
						username: socialAuthUser.user.email,
						email: socialAuthUser.user.email,
						roles: {},
					});
				})
			.then(() => {
			this.setState({ error: null });
			this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				this.setState({ error });
			});
			
		event.preventDefault();
	};

	render() {
		const { error } = this.state;

		return (
			<form onSubmit={this.onSubmit}>
				<Button type="submit">Sign In with Google</Button>

				{error && <p>{error.message}</p>}
			</form>
		);
	}
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
	backgroundPosition: 'center',
	minHeight: 1,
	minWidth: 1,
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
	alignItems: 'center',
	backgroundColor: 'transparent',
	boxShadow: 'none',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
	marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}));

const SignInPage = () => {
	const classes = useStyles();
	return (
		<div>
			<SignInForm classes={classes}/>
		</div>
	);
}

const INITIAL_STATE = {
	email: '',
	password: '',
	error: null,
};

class SignInFormBase extends Component {
	constructor(props){
		super(props);

		this.state = { ...INITIAL_STATE };
	}

	onSubmit = event => {
		const { email, password } = this.state;

		this.props.firebase
			.doSignInWithEmailAndPassword(email, password)
			.then(() => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				this.setState({ error });
			});

		event.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, password, error } = this.state;
		const isInvalid = password === '' || email === '';
		const classes = this.props.classes;
		
		return (
	  <div>
	  <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={this.onSubmit} noValidate>
            <TextField
              variant="outlined"
			  margin="normal"
			  onChange={this.onChange}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
			  />
            <TextField
              variant="outlined"
              margin="normal"
              required
			  fullWidth
			  onChange={this.onChange}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
			  />
            <Button
			  type="submit"
			  disabled={isInvalid}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
			  >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
			  <Button variant="contained" color="secondary" component={Link} to={ROUTES.PASSWORD_FORGET}>
                  {"Forget your password?"}
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" component={Link} to={ROUTES.SIGN_UP}>
                  {"Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
			{error && <p>{error.message}</p>}
          </form>
		<Grid item xs={3}>
			<SignInWithGoogle />
			<SignInWithFacebook />
		</Grid>
        </div>
      </Grid>
    </Grid>
</div>
  );
}
}

const SignInForm = compose(
	withRouter,
	withFirebase,
)(SignInFormBase);

const SignInWithGoogle = compose(
	withRouter,
	withFirebase,
)(SignInWithGoogleBase);

const SignInWithFacebook = compose(
	withRouter,
	withFirebase,
)(SignInWithFacebookBase);

export default SignInPage;

export { SignInForm, SignInWithGoogle, SignInWithFacebook };
