import React from 'react';
import Header from './Header';

const UnhandledError = () => {
    return(
        <div>
            <Header />
            <hr />
            <div className="bounds">
                <h1>Error</h1>
                <p>Sorry! We just encountered an unexpected error.</p>
            </div>
        </div>
    )
}
export default UnhandledError;