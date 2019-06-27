import React, { Component } from 'react';
import { compose } from 'recompose';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CardHeader from '@material-ui/core/CardHeader';


import {
	withAuthorization,
	withEmailVerification,
	AuthUserContext,
 } from '../Session';
import { Switch, Route, Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import { GridList, Input } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	card: {
	  maxWidth: 345,
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
		justifyContent: 'center',
		margin: '+2px',
	},
  }));


const ImageCard = ({ imageObject, authUser }) => {
	const classes = useStyles();

	return (
		<Card className={classes.card}>
      <CardHeader
        action={
			<IconButton aria-label="Settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={<Input defaultValue={imageObject.uid}/>}
		/>
      <CardMedia className={classes.media}
		image={imageObject.src}
		title={imageObject.toc}
		/>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Here you can make actions for the image and decide how you want to do the stuff
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
		<IconButton aria-label="Add to favorites" 
			// onClick={() => {
				
				// if (window.confirm('Are you sure you want to delete the picture? you can not have it back.')){
				// 	return delPicture(imageObject, authUser);
				// }
			// }}
			color={ 'primary' }
		>
          <FavoriteIcon />{imageObject.likes}
        </IconButton>
        <IconButton aria-label="Share">
          <ShareIcon />
        </IconButton>
        <IconButton
          component={Link} to={{
			  pathname: `${ROUTES.HOME}/${imageObject.uid}`,
			  state: { imageObject },
			  props: { authUser },
		  }}>
          <ExpandMoreIcon />
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


const HomePage = () => (
			<div>
				<h1>Home Page</h1>
					<p>The Home Page is Avaialbe to Signed In Users Only</p>
				<Switch>
					<Route exact path={ROUTES.HOME} component={Home} />
					<Route exact path={ROUTES.MYIMAGE} component={SinglePage} />
				</Switch>
			</div>
);

const ImageList = ({ images, authUser }) => {
	const classes = useStyles();

	return(
		<div>
			<GridList cols={3} spacing={0} cellHeight={400} classes={{ root: classes.root }}>
			{images.map(image => (
					<ImageCard imageObject={image} authUser={authUser} />
				// <Grid item >
				// </Grid>
			))}
			</GridList>
		</div>
	);
}

const iconAction = () => (
	<IconButton aria-label="Settings">
		<MoreVertIcon />
	</IconButton>
)

// const ImageItem = ({ imageObject }) => (
// 	<div>
// 		<ImageCard imageObject={imageObject} />
// 	</div>
// );

class SinglePageBase extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			imageObject: null,
			...props.location.state,
		};

	}

	componentDidMount() {
		if (this.state.imageObject) {
			return;
		}
		this.setState({ loading: true });
		
		this.props.firebase
			.image(this.props.authUser.uid, this.props.match.params.id)
			.on('value', snapshot => {
				this.setState({
					imageObject: snapshot.val(),
					loading: false,
				});
			});
	}

	componentWillUnmount() {
		this.props.firebase.image(this.props.authUser.uid, this.props.match.params.id).off();
	}

	render() {
		const { imageObject } = this.state;
		const classes = useStyles();

		return (
			<div>
				<Grid container>
					<Card className={classes.pageMain}>
						<CardHeader action={iconAction()} title={<Input defaultValue={imageObject.uid} />}/>
						<CardMedia className={classes.pageMedia} image={imageObject.src} title={imageObject.uid} />
						<img src={imageObject.src} alt={imageObject.src} />
					</Card>
				</Grid>
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

		this.props.firebase.gallery(this.props.authUser.uid).on('value', snapshot => {
			const imageObject = snapshot.val();

			if (imageObject) {
				const imgList = Object.keys(imageObject).map(key => ({
					...imageObject[key],
					uid: key,
				}));
				this.setState ({
					images: imgList,
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
		this.props.firebase.gallery(this.props.authUser.uid).off();
	}

	render() {
		const { text, images, loading } = this.state;

		return(
			<AuthUserContext.Consumer>
				{authUser => (
					<div>
						{loading && <div>Loading ...</div>}
						{images ? (
							<ImageList images={images} authUser={authUser}/>
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

const Home = withFirebase(HomeHome);
const SinglePage = withFirebase(SinglePageBase);
const Images = withFirebase(ImagesBase);

const condition = authUser => !!authUser;

export default compose(
	withEmailVerification,
	withAuthorization(condition),
)(HomePage);