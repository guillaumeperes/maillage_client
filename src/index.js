import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import App from "./components/App/App";
import reducers from "./reducers";
import "semantic-ui-css/semantic.min.css";
import "./index.css";

ReactDOM.render(
    <Provider store={createStore(reducers)}>
        <App />
    </Provider>,
    document.getElementById("root")
);
