import React from 'react';
import './App.css';
import { BrowserRouter as Router,
		Route,
} from 'react-router-dom';
import MyMenu from './components/AppBar';
import LandingPage from './components/Landing';
import SignUpPage from './components/SignUp';
import SignInPage from './components/SignIn';
import PasswordForgetPage from './components/PasswordForget';
import HomePage from './components/Home';
import AccountPage from './components/Account';
import AdminPage from './components/Admin';
import CameraPage from './components/Camera';
import GalleryPage from './components/Gallery';
import { withAuthentication } from './components/Session';
import * as ROUTES from './constants/routes.js';

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
			<Route path={ROUTES.GALLERY} component={GalleryPage} />
		</div>
	</Router>
);

export default withAuthentication(App);