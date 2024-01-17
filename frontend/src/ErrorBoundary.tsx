import * as React from "react";

function ErrorBoundary(props: {}) {

    return <div>
        <div className="container-fluid p-5 bg-danger text-white text-center">
            <h1>Something went wrong, please reload! 😭😭😭</h1>
        </div>
    </div>
}

export default ErrorBoundary;