import React from 'react';
import Header from './Header';
import {getCourse} from '../data';
import {Redirect} from 'react-router-dom';

class UpdateCourse extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            course: {},
            user: {}
        }
    }

    handleCancel = e => {
        e.preventDefault();
        this.setState({Redirect: `/courses/${this.props.match.params.id}`});
    }

    handleSubmit = e => {
        e.preventDefault();
        console.log('submit');
    }


    controller = new AbortController();

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

        if(this.state.Redirect) {
            return (
                <Redirect to={this.state.Redirect} />
            )
        }

        return (
            <div>
                <Header />
                <hr />
                <div className="bounds course--detail">
                    <h1>Update Course</h1>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="grid-66">
                                <div className="course--header">
                                    <h4 className="course--label">Course</h4>
                                    <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                                    defaultValue={this.state.course.title} /></div>
                                    <p>{this.state.user.firstName} {this.state.user.lastName}</p>
                                </div>
                                <div className="course--description">
                                    <div><textarea id="description" name="description" className="" placeholder="Course description..." defaultValue={this.state.course.description}></textarea></div>
                                    </div>
                                </div>
                                <div className="grid-25 grid-right">
                                    <div className="course--stats">
                                        <ul className="course--stats--list">
                                            <li className="course--stats--list--item">
                                                <h4>Estimated Time</h4>
                                                <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                                                placeholder="Hours" defaultValue={this.state.course.estimatedTime} /></div>
                                            </li>
                                            <li className="course--stats--list--item">
                                                <h4>Materials Needed</h4>
                                                <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." defaultValue={this.state.course.materialsNeeded}></textarea></div>
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