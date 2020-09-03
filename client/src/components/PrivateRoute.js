import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {Consumer} from '../Context';

//A HOC that renders a redirect to signin if the user is logged out or the requested component.It is used in the router in App.js 
export default ({ component: Component, ...rest }) => {
    return(
        <Consumer>
            {context => (
                <Route
                    {...rest}
                    render={props => context.authenticatedUser ? (
                        <Component {...props} />
                        ) : (
                            <Redirect to={{
                                pathname: '/signin',
                                state: { from: props.location }
                            }} />
                        )
                    }
                />
            )}
        </Consumer>
    );
};