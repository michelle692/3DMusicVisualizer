import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App";
import Graph from "./Graph";

const Routings = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<App />}></Route>
                <Route path='/graph' element={<Graph />} ></Route>
            </Routes>
        </Router>
    );

};

export default Routings