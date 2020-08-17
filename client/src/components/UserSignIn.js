import React from 'react';
import Header from './Header';
import {Redirect, Link} from 'react-router-dom'; 

class UserSignIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    controller = new AbortController();

    handleCancel = e => {
        e.preventDefault();
        this.setState({Redirect: `/`});
    }
    
    handleSignin = e => {
        e.preventDefault();
        const {context} = this.props;
        context.actions.signIn(this.controller.signal,this.state.username, this.state.password);

        //TODO: Add sign in code!!
    }

    handleEmailChange = e => {
        this.setState({username: e.target.value});
    }

    handlePasswordChange = e => {
        this.setState({password: e.target.value});
    }

    render() {

        if(this.state.Redirect) {
            return (
                <Redirect to={this.state.Redirect} />
            )
        }

        return (
            <div>
            <Header />
                <hr />
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
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