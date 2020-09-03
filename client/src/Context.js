import React from 'react';
import Cookies from 'js-cookie';
import {getUser} from './data/index';

const Context = React.createContext(); 

export class Provider extends React.Component {

    state = {
        authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
        rawPassword: Cookies.get("rawPassword") || null
    };


    render() {
        const { authenticatedUser, rawPassword } = this.state;
        const value = {
        authenticatedUser,
        rawPassword,
        actions: {
            signIn: this.signIn,
            signOut: this.signOut
        },
        };
        return (
        <Context.Provider value={value}>
            {this.props.children}
        </Context.Provider>  
        );
    }


    signIn = async (username, password, controllerSignal) => {
        //Send the sign in request to the API
        const user = await getUser(username, password, controllerSignal);
        if (user.ok) {
            //Sign in successful
            const userJSON = await user.json();
            this.setState({
                //Put the user in state and the password (in plain-text)
                //If I could re-work this, I would use tokens rather than plain text passwords being stored
                authenticatedUser: userJSON,
                rawPassword: password
            });
            const cookieOptions = {
                expires: 7 // 7 days
            };
            //We need to set these on Cookies. If the page refreshes, state will be lost so we can reload it from cookies
            Cookies.set('authenticatedUser', JSON.stringify(userJSON), cookieOptions);
            Cookies.set('rawPassword', password, cookieOptions);
        } else {
            return new Error();
        }
        return user;
    }

    //Sign out method. We just remove the authenticatedUser from state and remove the cookie
    signOut = () => {
        this.setState({ authenticatedUser: null });
        Cookies.remove('authenticatedUser');
    }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
    return function ContextComponent(props) {
        return (
            <Context.Consumer>
                {context => <Component {...props} context={context} />}
            </Context.Consumer>
        );
    }
}