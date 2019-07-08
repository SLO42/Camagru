import React, { Component } from 'react';

import { ImageList } from '../Home';

import { AuthUserContext, withAuthorization } from '../Session';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';


class GalleyPageBase extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			loading: false, 
			images: [],
		}

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
				
				const filtered = imgList.filter(image => image.likes);
				this.setState ({
					images: filtered,
					loading: false,
				});
			} else {
				this.setState({ loading: false, images: null });
			}
		});
	}

	componentWillUnmount() {
		this.props.firebase.gallery().off();
	}

	render() {
		const { loading, images } = this.state;

		return(
			<AuthUserContext.Consumer>
				{authUser => (
					<div>
						{loading && <div>Loading ...</div>}
						{images ? (
							<ImageList images={images} authUser={authUser} />
						) : (
							<div> No Images Found ...</div>
						)}
					</div>
				)}
			</AuthUserContext.Consumer>

		)
	}
}

const GalleryPage = withFirebase(GalleyPageBase);

export default compose(
	withAuthorization(authUser => !!authUser),
)(GalleryPage);
