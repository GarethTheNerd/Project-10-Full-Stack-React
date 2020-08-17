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

function App() {

    return (
        <Router>
            <Switch>
                <Route exact path="/" component={WithContext(Courses)} />
                <Route path="/courses/create" component={CreateCourse} />
                <Route path="/courses/:id/update" component={UpdateCourse} />
                <Route path="/courses/:id" component={CourseDetail} />
                <Route path="/signin" component={WithContext(UserSignIn)} />
                <Route path="/signup" component={UserSignUp} />
                <Route path="/signout" component={UserSignOut} />
                <Route path="/notfound" component={NotFound} />
                <Route path="/forbidden" component={Forbidden} />
                <Route path="/error" component={UnhandledError} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
}

export default App;
