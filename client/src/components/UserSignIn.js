import React from 'react';
import {Link, Redirect} from 'react-router-dom'; 

//Define a stateful component
class UserSignIn extends React.Component {

    //We need a constructor to define default state
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            signInError: false
        }
    }

    //We define the aborcontroller. This is attached to every fetch request. We can use it to cancel the request on unmount
    controller = new AbortController();

    //Cancel button handler 
    handleCancel = e => {
        e.preventDefault();
        this.props.history.push(`/`);
    }
    
    //Sign in button handeler. Send inputs to the sign in method on our context class.
    handleSignin = async e => {
        e.preventDefault();
        const {context} = this.props;
        const response = await context.actions.signIn(this.state.username, this.state.password, this.controller.signal)
        if(response.ok) {
            //We can sign them in. If a redirect has been set on the location prop, we direct there or the homepage
            let redirect = "/";
            if(this.props.location) {
                redirect = this.props.location.state.from;
            }

            this.props.history.push(redirect);
        } else {
            //Sign in was unsuccessful. We set state to show an error
            this.setState({signInError: true});
        }
    }

    //The following 2 functions just set state to match inputs
    handleEmailChange = e => {
        this.setState({username: e.target.value});
    }

    handlePasswordChange = e => {
        this.setState({password: e.target.value});
    }

    //This will cancel any ongoing fetch requests on this page. It is used to ensure no state updates happen after the component has unmounted
    componentWillUnmount() {
        this.controller.abort();
    }

    render() {
                
        return (
            <div>
                {/* If a user is already logged in, there is no need to login so we redirect them away */}
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