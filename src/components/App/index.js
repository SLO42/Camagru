import React from 'react';
import './App.css';
import { BrowserRouter as Router,
		Route,
} from 'react-router-dom';
import MyMenu from '../AppBar';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import CameraPage from '../Camera';
import { withAuthentication } from '../Session';
import * as ROUTES from '../../constants/routes.js';

const App = () => (
	<Router>
		<div>
			<MyMenu />

			<hr />

			<Route exact path={ROUTES.LANDING} component={LandingPage} />
			<Route path={ROUTES.SIGN_UP} component={SignUpPage} />
			<Route path={ROUTES.SIGN_IN} component={SignInPage} />
			<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
			<Route path={ROUTES.HOME} component={HomePage} />
			<Route path={ROUTES.ACCOUNT} component={AccountPage} />
			<Route path={ROUTES.ADMIN} component={AdminPage} />
			<Route path={ROUTES.CAMERA} component={CameraPage} />
		</div>
	</Router>
);

export default withAuthentication(App);