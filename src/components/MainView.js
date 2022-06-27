import React from 'react';
import { SubmitForm } from "./SubmitForm";
import { Aggregator } from "../aggregator/Aggregator";
import { Preview } from "./Preview";
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
        this.setState({ selectedDeck: null });
    }

    refreshGridList = async () => {
        const results = await (await fetch(`/api/leaderboard`)).json();
        const data = [];
        
        const decks = results;
        for (let i = 0; i < decks?.length; i++) {
          const item = decks[i];
            data.push({
            ...item,
          })
        };
    
        this.setState({ listItems: data });
      }

    getUrlParam = () => {
        const href = window.location.href;
        return href.substring(href.indexOf(`?sha=`) + 5) || ``;
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
            this.setState({isFetching: true});

            this.setState({
                progressStatus: {
                    label: `Getting deck list...`,
                    percentage: 0,
                }
            })
            
            const aggregator = new Aggregator();
            let data = await (await fetch(`/api/import?url=${value}`)).json()
            const commanders = Object.keys(data?.deck?.commanders);

            this.setState({
                deckDisplayData: {
                    commanders,
                    author: data?.deck?.author?.userName,
                    authorAvatarUrl: data?.deck?.author?.profileImageUrl,
                    title: data?.deck?.name,
                }   
            });

            const total = await aggregator.parseDeckList(data?.deck?.cards, this.handleAggregatorStatusUpdate);

            this.setState({isFetching: false});

            const response = await fetch(`/api/persist`, {
                method: "POST",
                body: JSON.stringify({
                    url: data?.deck?.url,
                    author: data?.deck?.author?.userName,
                    authorAvatarUrl: data?.deck?.author?.profileImageUrl,
                    commanders,
                    title: data?.deck?.name,
                    salt: total,
                    source: `moxfield`,
                    authorProfileUrl: `https://www.moxfield.com/users/${data?.deck?.author?.userName}`,
                })
            });

            this.setState({
                progressStatus: {
                    label: ``,
                    percentage: 0,
                }
            })

            await this.refreshGridList();
            
            const newDeckJson = await response.json();
            this.handleLeaderboardSelectionChange({ currentKey: newDeckJson?.id });
        } catch (error) {
            console.log(error);
        }
    };

    componentDidMount = async () => {
        await this.refreshGridList();

        const currentKey = this.getUrlParam();
        if (currentKey) {
           this.handleLeaderboardSelectionChange({ currentKey }) 
        }
    }

    handlePreviewDialogDismiss = (evn) => {
        this.setState({ selectedDeck: null });
    }

    handleLeaderboardSelectionChange = (evn) => {
        try {
            const {currentKey} = evn;
            const selectedDeck = this?.state?.listItems?.filter((value, index) => {
                return value.id === currentKey;
            })?.[0];

            window.history.pushState(null, '', `?sha=${currentKey}`);
            this.setState({ selectedDeck: selectedDeck });
            return;
        } catch (error) {
            console.log(`error :: ${error}`);
        }
        
        this.setState({ selectedDeck: null });
        
    }

    render() {
        const progressLabel = this?.state?.progressStatus?.label || '';
        const progressValue = this?.state?.progressStatus?.percentage || 0;
        const isFetching = this?.state?.isFetching || false;
        const items = this?.state?.listItems || [];
        const selectedDeck = this?.state?.selectedDeck || null;
        
        // const param = this.getUrlParam();
        
        return (
            <View height="100%">
                <View style={{position: 'absolute', top: 0}}>
                    <Header>
                        <Text size="L">EDH Salt Index</Text>
                    </Header>
                    <Divider size="M" />
                </View>
                <div style={{height: "100px"}} />
                <View alignItems="center" height="100%">
                    <Flex 
                        direction="column"  
                        alignItems="center"
                        margin="size-200"
                        height="100%"
                        gap="size-100">
                        <img src="resources/chef-kiss.png" width="100px" alt="MMM SALT!" />
                        
                        <div style={{height: "50px"}} />
                        
                        <Flex direction="column" width="100%" maxWidth="800px">
                            {isFetching
                                ? <ParseProgressIndicator label={progressLabel} progress={progressValue} />
                                : <SubmitForm listSubmitHandler={this.handleListSubmit} />// initialListUrl={param} />
                            }
                        </Flex>
                        <div style={{height: "50px"}} />
                        {selectedDeck 
                            ? <Preview deck={selectedDeck} onDismiss={this.handlePreviewDialogDismiss} />  
                            : <div style={{height: "0px"}} />
                        }
                        
                        {/* {selectedDeck 
                            ? <Preview deck={selectedDeck} />
                            : <div style={{height: "100px"}} />
                        } */}
                        
                        <LeaderBoard 
                            items={items}
                            selectionHandler={this.handleLeaderboardSelectionChange} />
                    </Flex>
                </View>
            </View>
        )
    }
}