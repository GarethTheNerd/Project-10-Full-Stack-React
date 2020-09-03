import React from 'react';
import {Link} from 'react-router-dom';

const Header = (props) => {

    let buttons;

    
    if(props.context.authenticatedUser) {
        //The user should have details that reflect them being logged in, such as log out
        buttons = <nav><Link className="signup" to="/">Hello, {props.context.authenticatedUser.firstName}</Link><Link className="signin" to="/signout">Sign Out</Link></nav>;
    } else {
        //The user needs sign in and register buttons
        buttons = <nav><Link className="signup" to="/signup">Sign Up</Link><Link className="signin" to="/signin">Sign In</Link></nav>;
    }

    return(
        <div className="header">
        <div className="bounds">
            <h1 className="header--logo">Courses</h1>
            {buttons}
        </div>
        </div>
    )
}
export default Header;