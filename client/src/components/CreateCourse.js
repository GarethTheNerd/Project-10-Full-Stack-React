import React from 'react';
import { createCourse } from '../data';

class CreateCourse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            estimatedTime: '',
            materialsNeeded: '',
            submitErrors: []
        };
    }
    
    controller = new AbortController();

    //Cancel button handler
    handleCancel = e => {
        e.preventDefault();
        this.props.history.push(`/`);
    }

    //Submit button handler
    handleSubmit = async e => {
        e.preventDefault();
        const {title, description, estimatedTime, materialsNeeded} = this.state;
                
        //We create the course object to send to the API
        const courseObject = {
            title,
            description,
            estimatedTime,
            materialsNeeded,
            userId: this.props.context.authenticatedUser.id
        }
        //We get the auth details together in an object to send across
        const authObject = {
            username: this.props.context.authenticatedUser.emailAddress,
            password: this.props.context.rawPassword
        }
        //Send the request to the API to create the course
        const response = await createCourse(courseObject, authObject, this.controller.signal);
        if(response.ok) {
            //Successful. We get the location header and send them to the newly created course
            const locationHeader = await response.headers.get("Location")
            this.props.history.push(locationHeader);
        } else if (response.status === 400) {
            //Validation errors. We get the errors and put them in state
            const errorsText = await response.text();
            const errors = await JSON.parse(errorsText).message;
            this.setState({
                submitErrors: errors
            })
        } else {
            this.props.history.push('/error');
        }
    }
    
    //Text change handlers to update state
    handleTitleChange = e => {
        this.setState({title: e.target.value});
    }
    handleDescriptionChange = e => {
        this.setState({description: e.target.value});
    }
    handleEstimatedTimeChange = e => {
        this.setState({estimatedTime: e.target.value});
    }
    handleMaterialsNeededChange = e => {
        this.setState({materialsNeeded: e.target.value});
    }

    //This will cancel any ongoing fetch requests on this page. It is used to ensure no state updates happen after the component has unmounted
    componentWillUnmount() {
        this.controller.abort();
    }

    render() {
        return(
            <div>
        <div className="bounds course--detail">
            <h1>Create Course</h1>
            <div>
            <div>
                {/* There were errors so we render the error headings etc */}
                {this.state.submitErrors.length === 0 ? null : 
                <>
                <h2 className="validation--errors--label">Validation errors</h2>
                <div className="validation-errors">
                <ul>
                {/* Loop over the errors */}
                {this.state.submitErrors.map(error => (
                        <li key={error}>{error}</li>   
                ))}
                </ul>
                </div>
                </>
                }
            </div>
            <form onSubmit={this.handleSubmit}>
                <div className="grid-66">
                <div className="course--header">
                    <h4 className="course--label">Course</h4>
                    <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..." onChange={this.handleTitleChange}/></div>
                    <p>By {this.props.context.authenticatedUser.firstName} {this.props.context.authenticatedUser.lastName}</p>
                </div>
                <div className="course--description">
                    <div><textarea id="description" name="description" className="" placeholder="Course description..." onChange={this.handleDescriptionChange}></textarea></div>
                </div>
                </div>
                <div className="grid-25 grid-right">
                <div className="course--stats">
                    <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                        <h4>Estimated Time</h4>
                        <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                            placeholder="Hours" onChange={this.handleEstimatedTimeChange}/></div>
                    </li>
                    <li className="course--stats--list--item">
                        <h4>Materials Needed</h4>
                        <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." onChange={this.handleMaterialsNeededChange}></textarea></div>
                    </li>
                    </ul>
                </div>
                </div>
                <div className="grid-100 pad-bottom"><button className="button" type="submit">Create Course</button><button className="button button-secondary" onClick={this.handleCancel}>Cancel</button></div>
            </form>
            </div>
        </div>
        </div>
        )
    }
}
export default CreateCourse;