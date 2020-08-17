import React from 'react';
import Header from './Header';

const Forbidden = () => {
    return(
        <div>
            <Header />
            <hr />
            <div className="bounds">
                <h1>Forbidden</h1>
                <p>Oh oh! You can't access this page.</p>
            </div>
        </div>
    )
}
export default Forbidden;