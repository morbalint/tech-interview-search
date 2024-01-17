import React from "react";
import {useLoaderData} from "react-router-dom";

function Doc() {

    const loaderData = useLoaderData() as {data: string}
    const lines = loaderData.data.split("\n")

    return (<div>
        {lines.map((line, idx) => <p key={`line-${idx}`}>{line}</p>)} // TODO: left align
    </div>)
}

export default Doc;