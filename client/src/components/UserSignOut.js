import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

export default (props) => {
    useEffect(() => {
        //Call signout on the context class and then redirect to the homepage
        props.context.actions.signOut();
    });

    return(
        <Redirect to="/" />
    );
}