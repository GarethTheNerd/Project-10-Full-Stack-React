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
            courseMaterialsNeeded: '',
            submitErrors: ''
        }
    }
    
    controller = new AbortController();

    //Cancel button handler
    handleCancel = e => {
        e.preventDefault();
        this.props.history.push(`/courses/${this.props.match.params.id}`);
    }

    //Submit button handler
    handleSubmit = async e => {
        e.preventDefault();
        const {courseId, courseTitle, courseDescription, courseEstimatedTime, courseMaterialsNeeded, user} = this.state;
        //Create our new course object
        const courseObject = {
            id: courseId,
            title: courseTitle,
            description: courseDescription,
            estimatedTime: courseEstimatedTime,
            materialsNeeded: courseMaterialsNeeded,
            userId: user.id
        }
        //Create a new auth object
        const authObject = {
            username: this.props.context.authenticatedUser.emailAddress,
            password: this.props.context.rawPassword
        }
        //Send the update request
        const response = await updateCourse(courseObject, courseId, authObject, this.controller.signal);
        if(response.ok) {
            //Course was updated
            this.props.history.push(`/courses/${courseId}`);
        } else if (response.status === 400) {
            //Validation errors. We get the errors and put them in state
            const errorsText = await response.json();
            this.setState({
                submitErrors: errorsText.message
            })
        } else if (response.status === 403) {
            //They don't have rights to update it
            this.props.history.push('/forbidden');
        } else {
            //Other errors
            this.props.history.push('/error');
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

    //This will cancel any ongoing fetch requests on this page. It is used to ensure no state updates happen after the component has unmounted
    componentWillUnmount() {
        this.controller.abort();
    }

    componentDidMount() {
        //We need to get the existing course to render the current course as a starting point
        const { id } = this.props.match.params;
        getCourse(id, this.controller.signal)
        .then(response => {
            if(response.ok) {
                response.json().then(responseString => {
                    if(responseString.userId === this.props.context.authenticatedUser.id) {
                        this.setState({
                            user: responseString.User,
                            courseId: responseString.id,
                            courseTitle: responseString.title,
                            courseDescription: responseString.description,
                            courseEstimatedTime: responseString.estimatedTime,
                            courseMaterialsNeeded: responseString.materialsNeeded
                            })
                    } else {
                        this.props.history.push('/forbidden');
                    }
                })               
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
                    {this.state.submitErrors === '' ? null : 
                    <>
                    <div className="validation-errors">
                    <span>{this.state.submitErrors}</span>
                    </div>
                    </>
                    }
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="grid-66">
                                <div className="course--header">
                                    <h4 className="course--label">Course</h4>
                                    <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                                    value={this.state.courseTitle} onChange={this.handleCourseTitleChange} /></div>
                                    <p>By {this.state.user.firstName} {this.state.user.lastName}</p>
                                </div>
                                <div className="course--description">
                                    <div><textarea id="description" name="description" className="" placeholder="Course description..." value={this.state.courseDescription} onChange={this.handleCourseDescriptionChange}></textarea></div>
                                    </div>
                                </div>
                                <div className="grid-25 grid-right">
                                    <div className="course--stats">
                                        <ul className="course--stats--list">
                                            <li className="course--stats--list--item">
                                                <h4>Estimated Time</h4>
                                                <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                                                placeholder="Hours" value={this.state.courseEstimatedTime} onChange={this.handleCourseEstimatedTimeChange}/></div>
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