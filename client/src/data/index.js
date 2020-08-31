const getData = async (url, method, data = null, fetchSignal, auth = null) => {
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        signal: fetchSignal
    }

    if(auth != null) {
        options.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${window.btoa(`${auth.username}:${auth.password}`)}`
        }
    }

    //Data needs to be added to the options object for post methods but fetch will return an error if it is added on get calls.
    if(method.toUpperCase() !== "GET") {
        options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    return response;        
}

export const getCourse = async (id, controllerSignal) => {
    const response = await getData(`http://localhost:5000/api/courses/${id}`, "GET", null, controllerSignal);
    return response;
}

export const getCourses = async (controllerSignal) => {
    const response = await getData(`http://localhost:5000/api/courses`, "GET", null, controllerSignal);
    return response;
}

export const getUser = async (username, password, controllerSignal) => {
    const response = await getData(`http://localhost:5000/api/users`, "GET", null, controllerSignal, {username, password});
    return response;
}

export const signUpUser = async (userObject, controllerSignal) => {
    const response = await getData(`http://localhost:5000/api/users`, "POST", userObject, controllerSignal);
    return response;
}
export const updateCourse = async (courseObject, courseId, authObject, controllerSignal) => {
    const response = await getData(`http://localhost:5000/api/courses/${courseId}`, "PUT", courseObject, controllerSignal, authObject);
    return response;
}
export const deleteCourse = async (courseId, authObject, controllerSignal) => {
    const response = await getData(`http://localhost:5000/api/courses/${courseId}`, "DELETE", null, controllerSignal, authObject);
    return response;
}