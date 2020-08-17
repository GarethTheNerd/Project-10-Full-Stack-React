import React from 'react';
import Header from './Header';
import {getCourses} from '../data';
import {Link, Redirect} from 'react-router-dom';


class Courses extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            courses: []
        }
    }

    controller = new AbortController();

    componentWillUnmount() {
        this.controller.abort();
    }

    deleteCourse = id => {
        console.log("deleted!")
    }

    componentDidMount(){

        getCourses(this.controller.signal)
        .then(response => {
            if(response.ok) {
                response.json().then(responseString => 
                    {this.setState({courses: responseString})}
                    )                
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
                <div className="bounds">
                    {this.state.courses.map(course => (
                        <div key={course.id} className="grid-33"><Link className="course--module course--link" to={`/courses/${course.id}`}>
                            <h4 className="course--label">Course</h4>
                            <h3 className="course--title">{course.title}</h3>
                            </Link>
                        </div>   
                    ))}
                    <div className="grid-33"><Link className="course--module course--add--module" to="/courses/create">
                    <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    viewBox="0 0 13 13" className="add">
                    <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                    </svg>New Course</h3>
                    </Link></div>
                </div>
            </div>
        )
    }
}
export default Courses;