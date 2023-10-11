'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SheetID = '1E2IxdeR_A51N_ts3PjZCKnDZ9xvEoHl07ZmRPeX32nQ',
    SheetName = 'FormResponses',
    APIkey = 'justkidding',
    baseURL = `https://sheets.googleapis.com/v4/spreadsheets/${SheetID}/values/${SheetName}?valueRenderOption=FORMATTED_VALUE&key=${APIkey}`;

export default function Profile() {

    const [allData, setAllData] = useState([]);

    function getAllData(URL) {

        axios.get(URL)
            .then(function (response) {
                formatResponse(response.data);
            })
            .catch(function (error) {
                onError(error);
            })
            .finally(function () {
                console.log("Job's done!")
            });
    }

    function formatResponse(response) {

        const keys = response.values[0],
            data = response.values.slice(1),
            obj = data.map(arr => Object.assign({}, ...keys.map((k, i) => ({ [k]: arr[i] }))));
        setAllData(obj[0]['Name']);
    }

    function onError(error) {
        console.error(error);
    }

    useEffect(() => { getAllData(baseURL) }, []);

    return <div>{allData}</div>
}