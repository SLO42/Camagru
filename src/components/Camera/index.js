import React from 'react';
import MyCamera from './webcamAndGallery';
import Grid from '@material-ui/core/Grid';

import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';

const CamAndGallery = () => (
			<div className="CamAndGallery" style={{ flexGrow: 1 }}>
				<div className="Paper" style={{ margin: 'auto',}}>
					<Grid container justify="center">
						<Grid container item md={'auto'} justify='center'>
							<MyCamera />
						</Grid>
					</Grid>
				</div>
			</div>
);

const condition = authUser => !!authUser;

export default compose(
	withEmailVerification,
	withAuthorization(condition),
)(CamAndGallery);