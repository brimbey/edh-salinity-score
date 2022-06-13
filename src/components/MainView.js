import React, { useState, useEffect } from 'react';
import { SubmitForm } from "./SubmitForm";
import { Aggregator } from "../aggregator/Aggregator";
import {Text} from '@adobe/react-spectrum'

export class MainView extends React.Component {

    constructor(props) {
        super(props);

        this.setState({message: ""});
        this.setState({parseStatus: ""});
    }

    handleAggregatorStatusUpdate = (evn) => {
        switch (evn?.type) {
            case `card`:
                this.setState({parseStatus: `found ${evn.card}, salt: ${evn.salt}`});
                break;
        }
    }

    handleListSubmit = async (value) => {
        this.setState({message: `loading...`});
        const url = value;
        
        const aggregator = new Aggregator();
        let data = await (await fetch(`/api/decklist?url=${value}`)).json()

        const total = await aggregator.parseDeckList(data.nodes, this.handleAggregatorStatusUpdate);

        this.setState({message: `SALT TOTAL: ${total}`});
        this.setState({parseStatus: ``});
    };

    render() {
        const message = this?.state?.message;
        const parseStatus = this?.state?.parseStatus;

        return (
            <div style={{ width: '100%' }}>
                <div style={{ width: '100%'}}> 
                    <SubmitForm listSubmitHandler={this.handleListSubmit} />
                    {/* <div>{message}</div>
                    <div>{parseStatus}</div> */}
                </div>
                <div>
                    <Text>{message}</Text>
                </div>
                <div>
                    <Text>{parseStatus}</Text>
                </div>
            </div>
        )
    }
}