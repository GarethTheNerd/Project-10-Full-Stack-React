import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

export default (props) => {
    useEffect(() => {
        props.context.actions.signOut();
    });

    return(
        <Redirect to="/" />
    );
}