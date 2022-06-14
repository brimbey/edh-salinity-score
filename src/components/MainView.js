import React from 'react';
import { SubmitForm } from "./SubmitForm";
import { Aggregator } from "../aggregator/Aggregator";
import {Text} from '@adobe/react-spectrum'

export class MainView extends React.Component {

    constructor(props) {
        super(props);

        this.setState({message: ""});
        this.setState({parseStatus: ""});
    }

    getUrlParam = () => {
        const href = window.location.href;
        const deckListParam = href.substring(href.indexOf(`?url=`) + 5);

        console.log(`DECKLIST PARAM :: ${deckListParam}`);

        if (deckListParam?.substring(0, 4) === `http`) {
            return deckListParam;
        } 

        return ``;
    }

    handleAggregatorStatusUpdate = (evn) => {
        switch (evn?.type) {
            case `card`:
                this.setState({parseStatus: `found ${evn.card}, salt: ${evn.salt}`});
                break;
            default:
                break;
        }
    }

    handleListSubmit = async (value) => {
        this.setState({message: `loading...`});

        window.history.pushState(null, '', `?url=${value}`);
        
        const aggregator = new Aggregator();
        let data = await (await fetch(`/api/decklist?url=${value}`)).json()

        const total = await aggregator.parseDeckList(data.nodes, this.handleAggregatorStatusUpdate);

        this.setState({message: `SALT TOTAL: ${total}`});
        this.setState({parseStatus: ``});
    };

    componentDidMount = () => {
        const param = this.getUrlParam();
        if (param) {
            this.handleListSubmit(param);
        }
    }

    render() {
        const message = this?.state?.message;
        const parseStatus = this?.state?.parseStatus;
        const param = this.getUrlParam();

        return (
            <div style={{ width: '100%' }}>
                <img src="https://www.clipartkey.com/mpngs/b/195-1953707_italian-chef-clip-art.png" width="100px" alt="MMM SALT!" />
                <div style={{ width: '100%'}}> 
                    <SubmitForm listSubmitHandler={this.handleListSubmit} initialListUrl={param} />
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