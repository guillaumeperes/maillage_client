import React from "react";
import { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Icon } from "semantic-ui-react";
import "./EventsSidebar.css";

export default class EventsSidebar extends Component {
    render() {
        return (
            <div className="EventsSidebar">
                <div className="EventsSidebar-title"><Icon name="feed" />Activité</div>
                <Scrollbars autoHide style={{ width: "100%", height: "calc(100% - 100px)" }}>
                    <div className="EventsSidebar-list">
                        contenu
                    </div>
                </Scrollbars>
            </div>
        );
    }
}
