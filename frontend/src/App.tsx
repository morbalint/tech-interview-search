import React from 'react';
import './App.css';
import Search from "./Search";
import Doc from "./Doc";
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import ErrorBoundary from "./ErrorBoundary";

function App() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Search />,
            ErrorBoundary,
        },
        {
            path: "/doc/:name",
            element: <Doc />,
            loader: args => fetch(`http://localhost:3001/doc?name=${args.params.name}`),
            ErrorBoundary,
        }

    ])

    return <div className="App">
        <RouterProvider router={router} />
    </div>
}

export default App;
