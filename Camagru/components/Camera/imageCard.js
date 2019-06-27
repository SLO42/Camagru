import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// debugger;

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
}));

const ImgCard = ({src, timeStamp, selected, liked, handleLike, authUser }) =>  {
	const [expanded, setExpanded] = React.useState(false);
	const imgToHandle = src;
	const newtime = timeStamp;
	const classes = useStyles();


	// async function handleLike() {
	// 	const imgobj = {
	// 		src: props.src,
	// 		toc: props.timeStamp
	// 	}
	// 	await saved.push(imgobj);
	// }
	if (!imgToHandle) return null;
	return (
		<Card className={classes.card}>
      <CardHeader
        action={
			<IconButton aria-label="Settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Currently Selected"
        subheader={newtime}
		/>
      <CardMedia
        className={classes.media}
        image={imgToHandle}
        title="Is u"
		/>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          Here you can make actions for the image and decide how you want to do the stuff
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
		<IconButton aria-label="Add to favorites" 
			onClick={() => {
				handleLike(imgToHandle, newtime, selected, authUser)}}
			color={liked ? 'primary' : 'default' }
		>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="Share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
			  [classes.expandOpen]: expanded,
			})}
			onClick={async () => await setExpanded(!expanded)}
			aria-expanded={expanded}
			aria-label="Show more"
			>
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}


export default ImgCard;