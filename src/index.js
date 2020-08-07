import React from "react";
import { render } from "react-dom";
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import App from "./App.js";

const routing = (
    <Router>
        <Switch>
            <Route exact path="/" component={ App } />
            <Route component={ App } />
        </Switch>
    </Router>
);

render( routing, document.getElementById( "app" ) );
