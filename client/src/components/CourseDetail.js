import React from 'react';
import {getCourse, deleteCourse} from '../data';
import {Link} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

class CourseDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            course: {},
            user: {},
            myCourse: false
        }
    }
    //This controller will be attached to every fetch request so we can cancel them
    controller = new AbortController();

    //This will cancel any ongoing fetch requests on this page. It is used to ensure no state updates happen after the component has unmounted
    componentWillUnmount() {
        this.controller.abort();
    }

    //Delete button handler
    handleDelete = async e => {
        e.preventDefault();
        //Pop up a prompt. Ask the user to confirm
        if (window.confirm('Are you sure you want to delete this course? This CANNOT be undone.')) {
            //We create a authobject to attach to the request. We get the details from context
            const authObject = {
                username: this.props.context.authenticatedUser.emailAddress,
                password: this.props.context.rawPassword
            }
            //Send the web request to delete the course
            const response = await deleteCourse(this.state.course.id, authObject, this.controller.signal);
            
            if(response.ok) {
                //Course deleted
                this.props.history.push('/');
            } else {
                //Error
                this.props.history.push('/error')
            }

            
        }
    } 

    componentDidMount() {
        //Component mounts. We need to get the course object
        const { id } = this.props.match.params;
        getCourse(id, this.controller.signal)
        .then(response => {
            if(response.ok) {
                //Request for course was successful
                response.json().then(responseString => {
                    //Put course and associated user into state
                    this.setState({
                        course: responseString,
                        user: responseString.User
                    });
                    
                    if(this.props.context.authenticatedUser != null) {
                        if(this.state.user.id === this.props.context.authenticatedUser.id) {
                            //This is the logged in users course.
                            this.setState({
                                //We set myCourse to true to unhide the update and delete buttons
                                myCourse: true
                            });
                        }
                    }
                });
                    
            } else {
                const error = new Error();
                error.response = response;
                throw error;
            }
        })
        .catch(error => {
            //An error happened. If the course wasn't found, we send them to not found.
            //If they don't have permission we send them to forbidden
            //or just generic error
            if(error.response.status === 404) {
                this.props.history.push('/notfound');
            } else if (error.response.status === 403) {
                this.props.history.push('/forbidden');
            } else {
                this.props.history.push('/error');
            }
        });
    } 

    render() {
        const {course, user} = this.state;

        return(
            <div>
            <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <span>
                            {/* This only renders the delete or update buttons if the course belongs to this user */}
                            {this.state.myCourse ? <Link className="button" to={`/courses/${course.id}/update`}>Update Course</Link> : null }
                            {this.state.myCourse ? <button className="button" href="#" onClick={this.handleDelete}>Delete Course</button> : null }
                        </span>
                        <Link className="button button-secondary" to="/">Return to List</Link></div>
                </div>
            </div>
            <div className="bounds course--detail">
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <h3 className="course--title"> {course.title} </h3>
                        <p>By {user.firstName} {user.lastName}</p>
                    </div>
                <div className="course--description">
                    {course.description}
                </div>
            </div>
            <div className="grid-25 grid-right">
                <div className="course--stats">
                    <ul className="course--stats--list">
                        <li className="course--stats--list--item">
                            <h4>Estimated Time</h4>
                            <h3>{course.estimatedTime}</h3>
                        </li>
                        <li className="course--stats--list--item">
                            <h4>Materials Needed</h4>
                            <ul>
                                <ReactMarkdown source={course.materialsNeeded} />
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </div>
        )
    }
}

export default CourseDetail;