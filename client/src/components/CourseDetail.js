import React from 'react';
import Header from './Header';
import {getCourse} from '../data';
import {Link, Redirect} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

class CourseDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            course: {},
            user: {}
        }
    }

    controller = new AbortController();

    componentWillUnmount() {
        this.controller.abort();
    }

    handleDelete = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this course? This CANNOT be undone.')) {
            window.alert("Delete here!")
        }
    } 

    componentDidMount() {
        const { id } = this.props.match.params;
        getCourse(id, this.controller.signal)
        .then(response => {
            if(response.ok) {
                response.json().then(responseString => 
                    {this.setState({
                        course: responseString,
                        user: responseString.User
                        })})               
            } else {
                const error = new Error();
                error.response = response;
                throw error;
            }
        })
        .catch(error => {
            if(error.response.status === 404) {
                this.setState({Redirect: '/notfound'});
            } else if (error.response.status === 403) {
                this.setState({Redirect: '/forbidden'});
            } else {
                this.setState({Redirect: '/error'});
            }
        });
    } 

    render() {
        const {course, user} = this.state;

        if(this.state.Redirect) {
            return (
                <Redirect to={this.state.Redirect} />
            )
        }

        return(
        <div>
            <Header />
            <hr />
            <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100"><span><Link className="button" to={`/courses/${course.id}/update`}>Update Course</Link><button className="button" href="#" onClick={this.handleDelete}>Delete Course</button></span><Link
                    className="button button-secondary" to="/">Return to List</Link></div>
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