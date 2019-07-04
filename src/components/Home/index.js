import React, { Component } from 'react';
import { compose } from 'recompose';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Box from '@material-ui/core/Box';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import SaveIcon from '@material-ui/icons/Save';
import CommentIcon from '@material-ui/icons/Comment';
import SettingsIcon from '@material-ui/icons/Settings';
import CardHeader from '@material-ui/core/CardHeader';
import ButtonBase from '@material-ui/core/ButtonBase';
import Badge from '@material-ui/core/Badge';

import {
	withAuthorization,
	withEmailVerification,
	AuthUserContext,
 } from '../Session';
import { Switch, Route, Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import { GridList, GridListTile } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
	card: {
	  minWidth: 420,
	  maxWidth: 420,
	  height: 460,
	  backgroundColor: 'transparent'
	},
	media: {
	  height: 0,
	  paddingTop: '56.25%', // 16:9
	},
	expand: {
	  transform: 'rotate(0deg)',
	  marginLeft: 'auto',
	  transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	  }),
	},
	expandOpen: {
	  transform: 'rotate(180deg)',
	},
	avatar: {
	  backg4roundColor: red[500],
	},
	root: {
		paddingBottom: 5,
		outlineColor: 'black',
		justifyContent: 'center',
	},
	images: {
		maxWidth: 420,
		minWidth: 420,
		// position: "absolute",
		margin: "auto",
	},
	pageMain: {
		minWidth: '720vl',
	  	backgroundColor: 'white',
	},
	pageMedia: {
		height: 0,

		paddingTop: '56.25%',
	},

  }));


const ImageCard = ({ imageObject, authUser }) => {
	const classes = useStyles();
	let desc = imageObject.comments[0].text;
	const otit = imageObject.title;
	// let oUid = imageObject.uid;


	return (
		<Card className={classes.card} style={{height: '490px'}}>
      <CardHeader
        action={
			<IconButton aria-label="Settings" component={Link} to={{
				pathname: `${ROUTES.HOME}/${imageObject.uid}`,
				state: { imageObject, authUser },
			}}>
            <SettingsIcon />
          </IconButton>
		}
		style={{whiteSpace: 'nowrap', fontSize: '1em'}}
        title={otit ? otit.length > 28 ? otit.substr(0, 28) + "..." : otit : null}
		/>
      <CardMedia className={classes.media}
		image={imageObject.src}
		title={imageObject.toc}
		/>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p" style={{wordWrap: 'none',}}>
          {desc ? desc.length > 150 ? (desc.substr(0, 150) + "...") : (desc) : "You can edit this field in the picture settings!" }
        </Typography>
      </CardContent>
      <CardActions disableSpacing style={{display: 'inline-flex', position: 'absolute', bottom: 0, right: '33%'}}>

		<IconButton aria-label="Add to favorites" 
			// onClick={() => {
				
				// if (window.confirm('Are you sure you want to delete the picture? you can not have it back.')){
					// 	return delPicture(imageObject, authUser);
					// }
					// }}
					color={ 'primary' }
					>
				<Badge badgeContent={imageObject.likes} >
        	<FavoriteIcon /> 
					</Badge>
        </IconButton>
        <IconButton aria-label="Share">
          <ShareIcon />
        </IconButton>
        <IconButton
          component={Link} to={{
			  pathname: `${ROUTES.HOME}/${imageObject.uid}`,
			  state: { imageObject, authUser },
		  }}>
          <CommentIcon />
		  <div style={{padding: `2px`}}>
		  	{imageObject.comments.length - 1}
		  </div>
        </IconButton>
      </CardActions>
    </Card>
	);
}

const HomeHome = () => (
	<AuthUserContext.Consumer>		
		{authUser => (
			<Images authUser={authUser} />
		)}
			</AuthUserContext.Consumer> 
)

const CommentList = ({ messages }) => (
	<ul>
		{messages.map(message => (
			<CommentItem key={message} message={message} />
		))}
	</ul>
)

const CommentItem = ({ message }) => (
	<li>
		<strong>{message.userId}</strong> {message.text}
	</li>
)

class CommentBase extends Component{
	constructor(props){
		super(props);

		this.state = {
			text: '',
			loading: false,
			messages: [],
		};
	}

	onChangeText = event => {
		this.setState({ text: event.target.value });
	};

	onCreateComment = () => {
		this.props.firebase.doWriteComment(this.props.imageObject.iid, this.state.text, this.props.authUser.uid);
		this.setState({ text: "" });
	}

	componentDidMount() {
		this.setState({ loading: true });

		this.props.firebase.comments(this.props.imageObject.iid)
			.on('value', snapshot => {
				const commentObject = snapshot.val();

				if (commentObject) {
					console.log(commentObject.length)

					this.setState({ 
						messages: commentObject,
						loading: false,
					});
				} else {
					this.setState({ messages: null, loading: false });
				}
			});
	}

	componentWillUnmount() {
		this.props.firebase.comments(this.props.imageObject.iid).off();
	}

	render () {
		const { text, messages, loading } = this.state;

		return (
			<CardContent>
				<div>
					{loading && <div>Loading ...</div>}

					{messages ? (
						<Card>
							<CommentList messages={messages} />
						</Card>
						) : (
							<div> There are no messages ... </div>
							)}
							<TextField id="CommentBox" labal="Leave a comment <3" multiline fullWidth
								onChange={this.onChangeText} value={text} />
								 <ButtonBase onClick={this.onCreateComment}> Submit </ButtonBase>
					{/* <form onSubmit={this.onCreateComment}>
						<input type="text" value={text} onChange={this.onChangeText} />
						<button type="submit"> Send </button>
					</form> */}
				</div>
			</CardContent>
		)
	}

}

const MainCard = ({ authUser, imageObject, doUpdateDesc, doUpdateUid, doUpdateLike }) => {
	const classes = useStyles();

	const [values, setValues] = React.useState({
		name: '',
		title: '',
		multiline: '',
	});
	
		
	const handleChange = name => event => {
		setValues({ ...values, [name]: event.target.value });
	  };

	const iconAction = () => (
		<IconButton aria-label="Settings" onClick={ async () => {
			if (window.confirm("would you like to save something?")){
				if(window.confirm("What would you like to update? Y = Desc n Title | N = more options ")){
					await doUpdateDesc(values.multiline);
					await doUpdateUid(values.title);
				} else {
					if (window.confirm("Update title?")){
						await doUpdateUid(values.title);
					} else {
						if (window.confirm("Update Desc?")){
							await doUpdateDesc(values.multiline);
						} else {
							return ;
						}
					}
				}
			} else {
				return ;
			}

		}
			}>
			<SaveIcon />
		</IconButton>
	)

	return(
		<div>
			<Grid container>
				<Card className={classes.pageMain} style={{minWidth: '100%'}}>
					<CardHeader action={iconAction()} title={
						<TextField id="Title" label="Title {Limit : 28 Characters}" fullWidth onChange={handleChange('title')} value={values.title} />
					}/>
					<CardMedia className={classes.pageMedia} image={imageObject ? imageObject.src : null} title={imageObject ? imageObject.uid : null} />
					<IconButton aria-label="Add to favorites" 
						onClick={() => {doUpdateLike(imageObject);}}
								color={ 'primary' }
								>
							<Badge badgeContent={imageObject.likes} >
						<FavoriteIcon /> 
								</Badge>
					</IconButton>

					<CardContent>
						{/* <Typography variant="body2" component="p"> */}
						<TextField
							id="Description Box" label="Description" multiline fullWidth rowsMax="4"
							value={values.multiline} onChange={handleChange('multiline')}
							className={classes.textField} margin="normal"
							variant="filled"
						/>

						<Grid container>

							<Card className={classes.commentMain} style={{minWidth: '98%', alignSelf: 'center'}} >
								<Comments  imageObject={imageObject} authUser={authUser}/>
							</Card>
						</Grid>
							{`${imageObject.comments[0].text}`}
						
					</CardContent>
				{/* This is where i would map the comments by comment order giving timestamp and metadata */}
				</Card>
			</Grid>
		</div>
	);
	}
// const MainCard = withStyles(useStyles)(MainCardBase);

const HomePage = () => {

	return(
			<div>
				<h1>Home Page</h1>
					<p>The Home Page is Avaialbe to Signed In Users Only</p>
				<Switch>
					<Route exact path={ROUTES.HOME} component={Home} />
					<Route exact path={ROUTES.MYIMAGE} component={SinglePage} />
				</Switch>
			</div>
)};

const ImageList = ({ images, authUser, firebase }) => {
	const classes = useStyles();

	//  const refresh = () => {
	// 	firebase.gallery(authUser.uid).child(image.uid).set(null);

	//  }

	return(
		<div>
			<GridList cols={3} spacing={0} cellHeight={500} classes={{ root: classes.root }}>
			{images.map(image => 
				image.src ? (
				<GridListTile key={image.uid} style={{minWidth: `500px`}} >
					<Box border={2} classes={{ root: classes.images }}>
						<ImageCard imageObject={image} authUser={authUser} />
					</Box>
				</GridListTile>
				// <Grid item >
				// </Grid>
			) : (null)
				)}
			</GridList>
		</div>
	);
}

// const ImageItem = ({ imageObject }) => (
// 	<div>
// 		<ImageCard imageObject={imageObject} />
// 	</div>
// );

class SinglePageBase extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			desc: '',
			loading: false,
			imageObject: null,
			doUpdateDesc: txt => {
				let { imageObject } = this.state;
				imageObject.comments[0].text = txt;
				this.props.firebase.updateDesc(this.state.imageObject.iid, txt);

				this.setState({ imageObject });
			},
			doUpdateUid: txt => {
				let { imageObject } = this.state;
				this.props.firebase.updateTitle(this.state.imageObject.iid, txt);
				imageObject.uid = txt;

				this.setState({ imageObject });
			},
			writeComment: txt => { 
				this.props.firebase.doWriteComment(this.state.imageObject.iid, txt, this.state.authUser.uid);
			},
			doUpdateLike: imageObject => {
				this.props.firebase.doOnLike(imageObject)
				imageObject.likes = imageObject.likes + 1;
					return (
						<MainCard />
					)
				
			},
			...props.location.state,
		};

	}

	// doUpdateDesc = event => {
	// 	this.state.firebase.updateDesc(this.state.authUser.uid, this.state.imageObject.uid, event.target.value);
	// }

	componentDidMount() {
		if (this.state.imageObject) {
			return;
		}
		this.setState({ loading: true });

		this.props.firebase
			.image(this.props.match.params.id)
			.on('value', snapshot => {
				this.setState({
					imageObject: snapshot.val(),
					loading: false,
				});
			});
	}

	componentWillUnmount() {
		this.props.firebase.image(this.props.match.params.id).off();
	}

	render() {

		const { imageObject, doUpdateDesc, doUpdateUid, doUpdateLike } = this.state;

		return (
			<div>
				{!this.state.loading &&  <MainCard
					authUser={this.state.authUser}
					imageObject={imageObject} 
					doUpdateDesc={doUpdateDesc} 
					doUpdateUid={doUpdateUid}
					doUpdateLike={doUpdateLike}
					/>}
			</div>
		)}
	
}



class ImagesBase extends Component {
	constructor(props){
		super(props);

		this.state = {
			text: '',
			loading: false,
			messages: [],
			images: [],
			delPicture: ( imageObject ) => (this.props.firebase.doRemoveLiked(imageObject, this.props.authUser)),
		};
	}

	onChangeText = event => {
		this.setState({ text: event.target.value });
	};

	onCreateMessage = (event, authUser) => {
		this.props.firebase.messages().push({
			text: this.state.text,
			userId: authUser.uid,
		});

		this.setState ({ text: '' });

		event.preventDefault();
	}

	componentDidMount() {
		this.setState({ loading: true });

		this.props.firebase.gallery().on('value', snapshot => {
			const imageObject = snapshot.val();

			if (imageObject) {
				const imgList = Object.keys(imageObject).map(key => ({
					...imageObject[key],
					uid: key,
				}));
				const newList = () => {
					const toRemove = imgList.filter(image => !image.likes);
					if (toRemove){
						toRemove.map(image => this.props.firebase.gallery(this.props.authUser.uid).child(image.uid).set(null));
					}
					const user_pics = imgList.filter(image => this.props.authUser.uid === image.comments[0].userId);
					return user_pics.filter(image => image.likes);
				}
				this.setState ({
					images: newList(),
					loading: false,
				});
			} else {
				this.setState({ messages: null, laoding: false, images: null });
			}
		});
	}

	deletePicture = imgUid => {

		let imSrc = imgUid.src;
		let imToc = imgUid.toc;
		const del = window.confirm('Are you sure you want to delete the picture? you can not have it back.');
		if (del) {
			return this.props.firebase.doRemoveLiked({ imSrc, imToc }, this.props.authUser);
		} else {
			return ;
		}
	}

	componentWillUnmount() {
		this.props.firebase.gallery().off();
	}

	render() {
		const { text, images, loading } = this.state;

		return(
			<AuthUserContext.Consumer>
				{authUser => (
					<div>
						{loading && <div>Loading ...</div>}
						{images ? (
							<ImageList images={images} authUser={authUser} firebase={this.props.firebase}/>
						) : (
							<div>There are no images ...</div>
						)}

						<form onSubmit={event => this.onCreateMessage(event, authUser)}>
							<input
								type="text"
								value={text}
								onChange={this.onChangeText}
							/>
							<button type="submit">Send</button>
						</form>
					</div>
			)}
			</AuthUserContext.Consumer>
		);
	}

}

const Comments = withFirebase(CommentBase);
const Home = withFirebase(HomeHome);
const Images = withFirebase(ImagesBase);

const condition = authUser => !!authUser;

const SinglePage = withFirebase(SinglePageBase);
export default compose(
	withEmailVerification,
	withAuthorization(condition),
)(HomePage);