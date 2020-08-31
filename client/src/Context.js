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
        const user = await getUser(username, password, controllerSignal);
        if (user.ok) {
            const userJSON = await user.json();
            this.setState({
                authenticatedUser: userJSON,
                rawPassword: password
            });
            const cookieOptions = {
                expires: 7 // 7 days
            };
            Cookies.set('authenticatedUser', JSON.stringify(userJSON), cookieOptions);
            Cookies.set('rawPassword', password, cookieOptions);
        } else {
            return new Error();
        }
        return user;
    }

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