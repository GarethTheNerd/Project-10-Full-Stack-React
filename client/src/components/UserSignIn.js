import React from 'react';
import {Link, Redirect} from 'react-router-dom'; 

class UserSignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            signInError: false
        }
    }

    controller = new AbortController();

    handleCancel = e => {
        e.preventDefault();
        this.props.history.push(`/`);
    }
    
    handleSignin = async e => {
        e.preventDefault();
        const {context} = this.props;
        const response = await context.actions.signIn(this.state.username, this.state.password, this.controller.signal)
        if(response.ok) {

            let redirect = "/";
            if(this.props.state) {
                redirect = this.props.location.state.from;
            }

            this.props.history.push(redirect);
        } else {
            this.setState({signInError: true});
        }
    }

    handleEmailChange = e => {
        this.setState({username: e.target.value});
    }

    handlePasswordChange = e => {
        this.setState({password: e.target.value});
    }

    render() {
                
        return (
            <div>
                {this.props.context.autheticatedUser === null ? <Redirect to="/" /> : null}
                <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign In</h1>
                    <div>
                        {this.state.signInError ? <h3 className="login-error">Error: Credentials were incorrect!</h3> : null }
                        <form onSubmit={this.handleSignin}>
                            <div><input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" onChange={this.handleEmailChange} /></div>
                            <div><input id="password" name="password" type="password" className="" placeholder="Password" onChange={this.handlePasswordChange}/></div>
                            <div className="grid-100 pad-bottom"><button className="button" type="submit">Sign In</button><button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
                        </form>
                    </div>
                <p>&nbsp;</p>
                <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
                </div>
                </div>
                </div>
                )
    }
}
export default UserSignIn;