import React from 'react';
import MyCamera from './webcamAndGallery';
import Grid from '@material-ui/core/Grid';

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

export default (CamAndGallery);