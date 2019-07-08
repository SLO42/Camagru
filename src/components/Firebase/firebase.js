import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import axios from 'axios';

const URL = 'http://localhost:3001/api/sendMail';

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
		this.func = app.functions();

		this.sendEmail = this.func.httpsCallable('sendEmail');
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

	doSendEmailNotify = async email => {
		await axios.post(URL, { email })
			.then(response => console.log(response))
			.catch(error => console.log(error));
		//messageServer();
		// this.sendEmail({ email }).then(result => {
		// 	console.log(result);
		// })
	}

	onAuthUserListener = (next, fallback) =>
		this.auth.onAuthStateChanged(authUser => {
			if (authUser) {
				this.user(authUser.uid)
					.once('value')
					.then(snapshot => {
						const dbUser = snapshot.val();

						if (!dbUser.roles) {
							dbUser.roles = {};
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


	

	doAddLiked = (imgObject) => {
		this.gallery().child(imgObject.iid).set(imgObject);
	}

	doOnLike = (imgObject) => {
		const like = imgObject.likes + 1;
		this.gallery().child(imgObject.iid).child("likes").set(like);
	}

	doOnDislike = (imgObject) => {
		const like = imgObject.likes - 1;
		this.gallery().child(imgObject.iid).child("likes").set(like);
	}

	doRemoveLiked = (imageId) => {
		if (window.confirm("Are you sure you want to delete the image?"))
			this.gallery().child(imageId).set(null);
		else ;
	}

	

	updateDesc = ( iid, txt ) => this.comment(iid, 0).child("text").set(txt);

	updateTitle = ( iid, txt ) => this.image(iid).child("title").set(txt);

	doWriteComment = (iid, txt, uid) => {
		const comRef = this.comments(iid);
		let i = 0;
		
		comRef.on("value", snapshot => { i = snapshot.numChildren()});

		comRef.child(`${i}`).set({
			text: txt,
			time: new Date().toLocaleDateString(),
			userId: uid,
		})
	}

	user = uid => this.db.ref(`users/${uid}`);

	users = () => this.db.ref('users');
	
	// message = uid => this.db.ref(`messages/${uid}`);

	// messages = () => this.db.ref('messages');

	// stickers = () => this.db.ref(`stickers`);
	
	gallery = () => this.db.ref(`gallery`);

	image = iid => this.db.ref(`gallery/${iid}`);

	comments = iid => this.db.ref(`gallery/${iid}/comments`);

	comment = (iid, n) => this.db.ref(`gallery/${iid}/comments/${n}`);

}

export default Firebase;