import React from 'react';
import { SubmitForm } from "./SubmitForm";
import { Aggregator } from "../aggregator/Aggregator";
import { Flex, View, Header, Divider, Text } from "@adobe/react-spectrum";
// import styles from './MainView.css';
import { LeaderBoard } from './LeaderBoard';
import { ParseProgressIndicator } from './ParseProgressIndicator';

export class MainView extends React.Component {

    constructor(props) {
        super(props);

        this.setState({message: ""});
        this.setState({parseStatus: ""});
        this.setState({
            progressStatus: {
                label: '',
                percentage: 0,
            }
        })
        this.setState({deckDisplayData: {
            author: "",
            authorAvatarUrl: "",
            title: "",
        }})
        this.setState({isFetching: false});
        this.setState({ listItems: [] });
    }

    refreshGridList = async () => {
        const results = await (await fetch(`/api/leaderboard`)).json();
        const data = [];
        
        const decks = results;
        for (let i = 0; i < decks?.length; i++) {
          const item = decks[i];
            data.push({
            id: `decklist_id_${i}`,
            ...item,
          })
        };
    
        this.setState({ listItems: data });
      }

    getUrlParam = () => {
        const href = window.location.href;
        const deckListParam = href.substring(href.indexOf(`?url=`) + 5);

        if (deckListParam?.substring(0, 4) === `http`) {
            return deckListParam;
        } 

        return ``;
    }

    handleAggregatorStatusUpdate = (evn) => {
        switch (evn?.type) {
            case `card`:
                this.setState({
                    progressStatus: {
                        label: `Parsing... ${evn.card}`,
                        percentage: evn.percentage,
                    }
                })
                break;
            default:
                break;
        }
    }

    handleListSubmit = async (value) => {
        try {
            this.setState({message: `loading...`});
            this.setState({isFetching: true});

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

            this.setState({isFetching: false});

            await fetch(`/api/saltmine`, {
                method: "POST",
                body: JSON.stringify({
                    url: data?.deck?.url,
                    author: data?.deck?.author?.userName,
                    authorAvatarUrl: data?.deck?.author?.profileImageUrl,
                    title: data?.deck?.name,
                    salt: total,
                    source: `moxfield`,
                    authorProfileUrl: `https://www.moxfield.com/users/${data?.deck?.author?.userName}`,
                })
            });

            this.refreshGridList();
        } catch (error) {
            console.log(error);
        }
    };

    componentDidMount = async () => {
        const param = this.getUrlParam();
        if (param) {
            // this.handleListSubmit(param);
        }

        this.refreshGridList();
    }

    render() {
        const progressLabel = this?.state?.progressStatus?.label || '';
        const progressValue = this?.state?.progressStatus?.percentage || 0;
        const isFetching = this?.state?.isFetching || false;
        const items = this?.state?.listItems || [];
        // const param = this.getUrlParam();
        
        return (
            <View>
                <View style={{position: 'absolute', top: 0}}>
                    <Header>
                        <Text size="L">EDH Salt Index</Text>
                    </Header>
                    <Divider size="M" />
                </View>
                <div style={{height: "100px"}} />
                <View alignItems="center">
                    <Flex 
                        direction="column"  
                        alignItems="center"
                        margin="size-200"
                        gap="size-100" >
                        <img src="resources/chef-kiss.png" width="100px" alt="MMM SALT!" />
                        
                        <div style={{height: "50px"}} />
                        
                        <Flex direction="column" width="100%" maxWidth="800px">
                            {isFetching
                                ? <ParseProgressIndicator label={progressLabel} progress={progressValue} />
                                : <SubmitForm listSubmitHandler={this.handleListSubmit} />// initialListUrl={param} />
                            }
                        
                        <div style={{height: "100px"}} />
                        
                            <LeaderBoard items={items} />
                        </Flex>
                    </Flex>
                </View>
            </View>
        )
    }
}