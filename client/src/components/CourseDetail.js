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

    controller = new AbortController();

    componentWillUnmount() {
        this.controller.abort();
    }

    handleDelete = async e => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this course? This CANNOT be undone.')) {
            const authObject = {
                username: this.props.context.authenticatedUser.emailAddress,
                password: this.props.context.rawPassword
            }
            
            const response = await deleteCourse(this.state.course.id, authObject, this.controller.signal);
            console.log(response);
            this.props.history.push('/');
        }
    } 

    componentDidMount() {
        const { id } = this.props.match.params;
        getCourse(id, this.controller.signal)
        .then(response => {
            if(response.ok) {
                response.json().then(responseString => {
                    this.setState({
                        course: responseString,
                        user: responseString.User
                    });
                    
                    if(this.props.context.authenticatedUser != null) {
                        if(this.state.user.id === this.props.context.authenticatedUser.id) {
                            this.setState({
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
            if(error.status === 404) {
                this.props.history.push('/notfound');
            } else if (error.status === 403) {
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