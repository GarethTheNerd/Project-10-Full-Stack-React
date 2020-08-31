import React from 'react';
import {signUpUser} from '../data';
import {Redirect} from 'react-router-dom';

class UserSignUp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            emailAddress: '',
            password: '',
            confirmPassword: '',
            signupErrors: [""]
        };
    }

    controller = new AbortController();

    handleCancel = e => {
        e.preventDefault();
        this.props.history.push(`/`);
    }

    handleSubmit = async e => {
        e.preventDefault();
        const {firstName, lastName, emailAddress, password} = this.state;
        const userObject = {
            firstName,
            lastName,
            emailAddress,
            password,
        }
        const response = await signUpUser(userObject, this.controller.signal);

        if(response.ok) {
            //Signup was successful. We will now sign them in with thier newly created account!
            const {context} = this.props;
            const loginResponse = await context.actions.signIn(this.controller.signal,this.state.emailAddress, this.state.password)
            if(loginResponse.ok) {
                this.props.history.push('/');
            } else {
                this.setState({signupErrors: ["Failed to sign in with new account"]});
            }
        } else if (response.status === 400) {
            const errorsText = await response.text();
            const errors = await JSON.parse(errorsText).message;
            this.setState({
                signupErrors: errors
            })
        } else {
            this.history.push('/error');
        }

    }

    handleFirstNameChange = e => {
        this.setState({firstName: e.target.value});
    }
    
    handleLastNameChange = e => {
        this.setState({lastName: e.target.value});
    }
    handleEmailAddressChange = e => {
        this.setState({emailAddress: e.target.value});
    }
    handlePasswordChange = e => {
        this.setState({password: e.target.value});
    }
    handleConfirmPasswordChange = e => {
        this.setState({confirmPassword: e.target.value});
    }

    render() {

        return (                
            <div className="bounds">
                {this.props.context.autheticatedUser === null ? <Redirect to="/" /> : null}
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    <div>

                    {this.state.signupErrors.map(error => (
                        <div className="signup-error" key={error}>{error}</div>   
                    ))}

                        <form onSubmit={this.handleSubmit}>
                            <div><input id="firstName" name="firstName" type="text" className="" placeholder="First Name" onChange={this.handleFirstNameChange} /></div>
                            <div><input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" onChange={this.handleLastNameChange} /></div>
                            <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" onChange={this.handleEmailAddressChange} /></div>
                            <div><input id="password" name="password" type="password" className="" placeholder="Password" onChange={this.handlePasswordChange} /></div>
                            <div><input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" onChange={this.handleConfirmPasswordChange}/></div>
                            <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign Up</button><button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Already have a user account? <a href="sign-in.html">Click here</a> to sign in!</p>
                </div>
            </div>
        )
    }
}
export default UserSignUp;