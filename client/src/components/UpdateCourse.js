import React from 'react';
import {getCourse, updateCourse} from '../data';

class UpdateCourse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            courseTitle: '',
            courseDescription: '',
            courseEstimatedTime: '',
            courseMaterialsNeeded: ''
        }
    }
    
    controller = new AbortController();

    handleCancel = e => {
        e.preventDefault();
        this.props.history.push(`/courses/${this.props.match.params.id}`);
    }

    handleSubmit = async e => {
        e.preventDefault();
        const {courseId, courseTitle, courseDescription, courseEstimatedTime, courseMaterialsNeeded, user} = this.state;
        const courseObject = {
            id: courseId,
            title: courseTitle,
            description: courseDescription,
            estimatedTime: courseEstimatedTime,
            materialsNeeded: courseMaterialsNeeded,
            userId: user.id
        }
        const authObject = {
            username: this.props.context.authenticatedUser.emailAddress,
            password: this.props.context.rawPassword
        }
        const response = await updateCourse(courseObject, courseId, authObject, this.controller.signal);
        if(response.ok) {
            this.props.history.push(`/courses/${courseId}`);
        }
    }

    handleCourseTitleChange = e => {
        this.setState({courseTitle: e.target.value});
    }

    handleCourseDescriptionChange = e => {
        this.setState({courseDescription: e.target.value});
    }

    handleCourseEstimatedTimeChange = e => {
        this.setState({courseEstimatedTime: e.target.value});
    }
    
    handleCourseMaterialsNeededChange = e => {
        this.setState({courseMaterialsNeeded: e.target.value});
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        getCourse(id, this.controller.signal)
        .then(response => {
            if(response.ok) {
                response.json().then(responseString => 
                    {this.setState({
                        user: responseString.User,
                        courseId: responseString.id,
                        courseTitle: responseString.title,
                        courseDescription: responseString.description,
                        courseEstimatedTime: responseString.estimatedTime,
                        courseMaterialsNeeded: responseString.materialsNeeded
                        })})               
            } else {
                const error = new Error();
                error.response = response;
                throw error;
            }
        })
        .catch(error => {
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

        return (
            <div>
                <div className="bounds course--detail">
                    <h1>Update Course</h1>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="grid-66">
                                <div className="course--header">
                                    <h4 className="course--label">Course</h4>
                                    <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                                    defaultValue={this.state.courseTitle} onChange={this.handleCourseTitleChange} /></div>
                                    <p>By {this.state.user.firstName} {this.state.user.lastName}</p>
                                </div>
                                <div className="course--description">
                                    <div><textarea id="description" name="description" className="" placeholder="Course description..." defaultValue={this.state.courseDescription} onChange={this.handleCourseDescriptionChange}></textarea></div>
                                    </div>
                                </div>
                                <div className="grid-25 grid-right">
                                    <div className="course--stats">
                                        <ul className="course--stats--list">
                                            <li className="course--stats--list--item">
                                                <h4>Estimated Time</h4>
                                                <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                                                placeholder="Hours" defaultValue={this.state.courseEstimatedTime} onChange={this.handleCourseEstimatedTimeChange}/></div>
                                            </li>
                                            <li className="course--stats--list--item">
                                                <h4>Materials Needed</h4>
                                                <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." defaultValue={this.state.courseMaterialsNeeded} onChange={this.handleCourseMaterialsNeededChange}></textarea></div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="grid-100 pad-bottom"><button className="button" type="submit">Update Course</button><button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
}
export default UpdateCourse;