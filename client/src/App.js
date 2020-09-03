import React from 'react';
import './global.css';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import UserSignUp from './components/UserSignUp';
import NotFound from './components/NotFound';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';
import WithContext from './Context';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

const HeaderWithContext = WithContext(Header);

function App() {

    return (
        //We define a router. The header is on every page
        <Router>
            <HeaderWithContext />
            <hr />
            {/* We define all our routes. This component gets rendered on the single page of our app and renders the correct component for the current route  */}
            <Switch>
                <Route exact path="/" component={WithContext(Courses)} />
                <PrivateRoute path="/courses/create" component={WithContext(CreateCourse)} />
                <PrivateRoute path="/courses/:id/update" component={WithContext(UpdateCourse)} />
                <Route path="/courses/:id" component={WithContext(CourseDetail)} />
                <Route path="/signin" component={WithContext(UserSignIn)} />
                <Route path="/signup" component={WithContext(UserSignUp)} />
                <Route path="/signout" component={WithContext(UserSignOut)} />
                <Route path="/notfound" component={NotFound} />
                <Route path="/forbidden" component={Forbidden} />
                <Route path="/error" component={UnhandledError} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    )
}

export default App;
