import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import * as ROUTES from '../../constants/routes';

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

const INITIAL_STATE = {
	email: '',
	passwordOne: '',
	passwordTwo: '',
	error: null,
};

const SignUpPage = () => {
	const classes = useStyles();
	return (
	<div>
		<SignUpForm classes={classes}/>
	</div>
	)
}


class SignUpFormBase extends Component {

	constructor(props){
		super(props);
		this.state = { ...INITIAL_STATE };
	}
	
	onSubmit = event => {
		const { email, passwordOne } = this.state;

		this.props.firebase
			.doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
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
		const classes = this.props.classes;
	const {
			email,
			passwordOne,
			passwordTwo,
			error,
		} = this.state;

	const isInvalid = 
		passwordOne !== passwordTwo ||
		passwordOne === '' ||
		email === '';

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
                autoComplete="email"
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
                autoComplete="current-password"
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
                autoComplete="current-password"
				/>
            </Grid>
          </Grid>
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
