import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

const PasswordForgetPage = () => (
	<div>
		<h2>Password Forget Page</h2>
		<PasswordForgetForm />
	</div>
);

const INITIAL_STATE = {
	email: '',
	error: null,
};

class PasswordForgetFormBase extends Component {
	constructor(props)
	{
		super(props);

		this.state = { ...INITIAL_STATE };
	}
	
	onSubmit = event => {
		const { email } = this.state;

		this.props.firebase
			.doPasswordReset(email)
			.then(() => {
				this.setState({	...INITIAL_STATE });
			})
			.catch(error => {
				this.setState({ error });
			});

		event.preventDefault();
	};

	onChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	render() {
		const { email, error } = this.state;

		const isInvalid = email === '';
		
		return (
			<form onSubmit={this.onSubmit}>
				<input
					name="email"
					value={this.state.email}
					onChange={this.onChange}
					type="text"
					placeholder="Email Address"
					/>
				<button disabled={isInvalid} type="submit">
					Reset Password
				</button>

				{error && <p>{error.message}</p>}
			</form>
		)
	}
}

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm };