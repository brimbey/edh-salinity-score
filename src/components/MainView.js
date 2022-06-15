import React from 'react';
import { SubmitForm } from "./SubmitForm";
import { Aggregator } from "../aggregator/Aggregator";
import {Text} from '@adobe/react-spectrum'
import styles from './MainView.css';
import { LeaderBoard } from './LeaderBoard';

export class MainView extends React.Component {

    constructor(props) {
        super(props);

        this.setState({message: ""});
        this.setState({parseStatus: ""});
        this.setState({deckDisplayData: {
            author: "",
            authorAvatarUrl: "",
            title: "",
        }})
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
        try {
            this.setState({message: `loading...`});

            window.history.pushState(null, '', `?url=${value}`);
            
            const aggregator = new Aggregator();
            let data = await (await fetch(`/api/decklist?url=${value}`)).json()

            this.setState({
                deckDisplayData: {
                    author: data?.deck?.author?.userName,
                    authorAvatarUrl: data?.deck?.author?.profileImageUrl,
                    title: data?.deck?.name,
                }   
            });

            const total = await aggregator.parseDeckList(data?.deck?.cards, this.handleAggregatorStatusUpdate);

            this.setState({message: `SALT TOTAL: ${total}`});
            this.setState({parseStatus: ``});

            await fetch(`/api/saltmine`, {
                method: "POST",
                body: JSON.stringify({
                    url: data?.deck?.url,
                    author: data?.deck?.author?.userName,
                    authorAvatarUrl: data?.deck?.author?.profileImageUrl,
                    title: data?.deck?.name,
                    salt: total,
                })
            });
        } catch (error) {
            console.log(error);
        }
    };

    componentDidMount = async () => {
        const param = this.getUrlParam();
        if (param) {
            this.handleListSubmit(param);
        }

        await (await fetch(`/api/leaderboard`)).json();
    }

    render() {
        const message = this?.state?.message;
        const parseStatus = this?.state?.parseStatus;
        const author = this?.state?.deckDisplayData?.author;
        const avatar = this?.state?.deckDisplayData?.authorAvatarUrl;
        const name = this?.state?.deckDisplayData?.title;
        const param = this.getUrlParam();

        return (
            <div style={{ width: '100%' }}>
                <img src="https://www.clipartkey.com/mpngs/b/195-1953707_italian-chef-clip-art.png" width="100px" alt="MMM SALT!" />
                <div style={{ width: '100%'}}> 
                    <SubmitForm listSubmitHandler={this.handleListSubmit} initialListUrl={param} />
                </div>
                <div>
                    {author && 
                        <div> 
                            <span className={styles.authorText}>
                                <img src={avatar} width="75px" alt="avatar" />
                                {/* {author} */}
                            </span>
                            <span className={styles.AuthorText}>
                                {name}
                                {/* Deck name: {name} */}
                            </span>
                        </div>
                    }
                </div>
                <div>
                    <Text>{message}</Text>
                </div>
                <div>
                    <Text>{parseStatus}</Text>
                </div>
                <LeaderBoard />
            </div>
        )
    }
}