import React, { useState } from 'react';

const QueryForm = () => {

    // Data for controlled form. TO make query
    const [query, setQuery] = useState({
        query: "",
        postal: "",
        topk: 0,
    });
    type queryMode = "random" | "embed";
    const [queryMode, setQueryMode] = useState<queryMode>("random");

    const resetForm = () => {
        setQuery({
            query: "",
            postal: "",
            topk: 0,
        })
    }

    return(
        <>
            <p>This is my test</p>
        </>
    )
}

export default QueryForm;