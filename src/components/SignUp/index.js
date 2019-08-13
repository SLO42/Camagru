import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import * as ROLES from '../../constants/roles';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
	email: '',
	passwordOne: '',
	passwordTwo: '',
	isAdmin: false,
	adminPass: '',
	error: null,
};

const SignUpPage = () => {
	const useStyles = makeStyles(theme => ({
		'@global': {
		  body: {
			backgroundColor: theme.palette.common.white,
		  },
		},
		paper: {
		  marginTop: theme.spacing(8),
		  display: 'flex',
		  flexDirection: 'column',
		  alignItems: 'center',
		},
		avatar: {
		  margin: theme.spacing(1),
		  backgroundColor: theme.palette.secondary.main,
		},
		form: {
		  width: '100%', // Fix IE 11 issue.
		  marginTop: theme.spacing(3),
		},
		submit: {
		  margin: theme.spacing(3, 0, 2),
		},
	  }));
	const classes = useStyles();
	return (
	<div>
		<SignUpForm classes={classes}/>
	</div>
	)
}

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_NO_REDIRECT = 'auth/missing-continue-uri';

const ERROR_MSG_ACCOUNT_EXISTS = `
	An account with this E-Mail address already exists.
	Try to login with this account instead. If you think the
	account is already used from one of the social logins, try
	to sign-in with one of them. Afterward, associate your accounts
	on your personal account page.
`;


class SignUpFormBase extends Component {

	constructor(props){
		super(props);
		this.state = { ...INITIAL_STATE };
	}
	
	onSubmit = event => {
		const { email, passwordOne, isAdmin } = this.state;
		const roles = {};

		if (isAdmin) {
			roles[ROLES.ADMIN] = ROLES.ADMIN;
		}

		this.props.firebase
			.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
				return this.props.firebase
					.user(authUser.user.uid)
					.set({
						username: email,
						email,
						roles,
					});
			})
			.then(() => {
				return this.props.firebase.doSendEmailVerification();
			})
			.then(() => {
				this.setState({ ...INITIAL_STATE });
				this.props.history.push(ROUTES.HOME);
			})
			.catch(error => {
				if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
					error.message = ERROR_MSG_ACCOUNT_EXISTS;
				}
				if (error.code === ERROR_NO_REDIRECT) {
					return this.props.history.push(ROUTES.HOME);
				}
				this.setState({ error });
			});

		event.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	onChangeCheckbox = event => {
		this.setState({ [event.target.name]: event.target.checked });
	};

	render() {
		const classes = this.props.classes;
	const {
			email,
			passwordOne,
			passwordTwo,
			isAdmin,
			adminPass,
			error,
		} = this.state;

	const isInvalid = 
		passwordOne !== passwordTwo ||
		passwordOne === '' ||
		email === '' ||
		(isAdmin &&  adminPass !== process.env.REACT_APP_ADMIN_PASS);

  return (
	  <div>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={this.onSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
				fullWidth
				value={email}
				onChange={this.onChange}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="none"
				/>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordOne"
				label="Password"
				value={passwordOne}
				onChange={this.onChange}
                type="password"
                id="password"
                autoComplete="none"
				/>
            </Grid>
			<Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordTwo"
				label="Confirm Password"
				value={passwordTwo}
				onChange={this.onChange}
                type="password"
                id="passwordTwo"
                autoComplete="none"
				/>
            </Grid>
          </Grid>
		  <label>
			Admin:
			<input
				name="isAdmin"
				type="checkbox"
				checked={isAdmin}
				onChange={this.onChangeCheckbox}
			/>
		  </label>
		  {isAdmin ? (
			  <TextField
				  variant="outlined"
				  required
				  fullWidth
				  name="adminPass"
				  label="Please Enter The Admin Password"
				  value={adminPass}
				  onChange={this.onChange}
				  type="password"
				  id="adminPass"
				  autoComplete="none"
				  />
		  ) : null }
          <Button
            type="submit"
			fullWidth
			disabled={isInvalid}
            variant="contained"
            color="primary"
            className={classes.submit}
			>
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <ButtonBase component={Link} to={ROUTES.SIGN_IN} >Already have an account? Sign in</ButtonBase>
            </Grid>
          </Grid>
	{error && <p>{error.message}</p>}
        </form>
      </div>
    </Container>
			</div>
  );
	}
}
const SignUpForm = compose(
	withRouter,
	withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm };
