import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_DATABASE_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUK,
	messagingSenderId: process.env.REACT_APP_MESS_ID,
	appId: process.env.REACT_APP_APP_ID
};

class Firebase {
	constructor() {
		app.initializeApp(config);

		this.emailAuthProvider = app.auth.EmailAuthProvider;
		this.auth = app.auth();
		this.db = app.database();

		this.googleProvider = new app.auth.GoogleAuthProvider();
		this.facebookProvider = new app.auth.FacebookAuthProvider();
		this.twitterProvider = new app.auth.TwitterAuthProvider();
	}

	doCreateUserWithEmailAndPassword = (email, password) =>
		this.auth.createUserWithEmailAndPassword(email, password);

	doSignInWithEmailAndPassword = (email, password) =>
		this.auth.signInWithEmailAndPassword(email, password);

	doSignInWithGoogle = () =>
		this.auth.signInWithPopup(this.googleProvider);

	doSignInWithFacebook = () => 
		this.auth.signInWithPopup(this.facebookProvider);
	
	doSignInWithTwitter = () =>
		this.auth.signInWithPopup(this.twitterProvider);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = email =>
		this.auth.sendPasswordResetEmail(email);
	
	doPasswordUpdate = password =>
		this.auth.currentUser.updatePassword(password);

	doSendEmailVerification = () => 
		this.auth.currentUser.sendEmailVerification({
			url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
		});

	onAuthUserListener = (next, fallback) =>
		this.auth.onAuthStateChanged(authUser => {
			if (authUser) {
				this.user(authUser.uid)
					.once('value')
					.then(snapshot => {
						const dbUser = snapshot.val();
						const comment = { commentId: null, commentMessage: null, time: null };
						const dbGallery = [
							{ src: null, toc: null, likes: 0, comments: [comment] }
						]

						if (!dbUser.roles) {
							dbUser.roles = {};
						}

						if (!dbUser.gallery) {
							dbUser.gallery = dbGallery;
						}

						authUser = {
							uid: authUser.uid,
							email: authUser.email,
							emailVerified: authUser.emailVerified,
							providerData: authUser.providerData,
							...dbUser,
						};

						next(authUser);
					});
			} else {
				fallback();
			}
		});

	doAddLiked = (imgObject, authUser) => {
		let firstCut = imgObject.src.slice(11, 15);
		let secondCut = imgObject.src.slice(imgObject.src.length - 25, imgObject.src.length - 11);
		let sliced = firstCut + secondCut;
		sliced = sliced.replace(/\//g, "");
		this.gallery(authUser.uid).child(sliced).set(imgObject);
	}

	doRemoveLiked = (imgObject, authUser) => {
		let firstCut = imgObject.src.slice(11, 15);
		let secondCut = imgObject.src.slice(imgObject.src.length - 25, imgObject.src.length - 11);
		let sliced = firstCut + secondCut;
		sliced = sliced.replace(/\//g, "");

		this.gallery(authUser.uid).child(sliced).set(null);
	}

	

	user = uid => this.db.ref(`users/${uid}`);

	users = () => this.db.ref('users');
	
	message = uid => this.db.ref(`messages/${uid}`);

	messages = () => this.db.ref('messages');
	
	gallery = uid => this.db.ref(`users/${uid}/gallery`);

	image = (uid, src) => this.db.ref(`users/${uid}/gallery/${src}`);

	comment = (uid, src) => this.db.ref(`users/${uid}/gallery/${src}/comments`)

}

export default Firebase;