import React from "react";
import { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Icon } from "semantic-ui-react";
import { Dimmer } from "semantic-ui-react";
import { Loader } from "semantic-ui-react";
import "./EventsSidebar.css";

export default class EventsSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "isLoading": true,
            "events": []
        };
    }

    componentDidMount() {
        this.setState({
            "isLoading": false,
            "events": []
        });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="EventsSidebar">
                    <div className="EventsSidebar-title">Activité<Icon name="feed" /></div>
                    <div className="EventsSidebar-loader">
                        <Dimmer.Dimmable as="div">
                            <Dimmer active inverted>
                                <Loader size="small" inverted>Chargement en cours</Loader>
                            </Dimmer>
                        </Dimmer.Dimmable>
                    </div>
                </div>
            );
        } else if (this.state.events.length === 0) {
            return (
                <div className="EventsSidebar">
                    <div className="EventsSidebar-title">Activité<Icon name="feed" /></div>
                    <div className="EventsSidebar-empty">
                        Aucune activité n'est répertoriée.
                    </div>
                </div>
            );
        } else {
            return (
                <div className="EventsSidebar">
                    <div className="EventsSidebar-title">Activité<Icon name="feed" /></div>
                    <Scrollbars autoHide style={{ width: "100%", height: "calc(100% - 100px)" }}>
                        <div className="EventsSidebar-list">
                            contenu
                        </div>
                    </Scrollbars>
                </div>
            );
        }
    }
}
