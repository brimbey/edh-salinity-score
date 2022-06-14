import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@adobe/react-spectrum";
import { Button } from "@adobe/react-spectrum";
import {Text} from '@adobe/react-spectrum'

export class SubmitForm extends React.Component {

  currentDeckUrl = ``;

  static propTypes = {
    listSubmitHandler: PropTypes.func,
    initialListUrl: PropTypes.string,
  }

  handleOnPress = (event) => {
    this.props.listSubmitHandler(this.currentDeckUrl);
  }

  handleOnChange = (val) => {
    this.currentDeckUrl = val;
  }
  

  render() {
      return (
        
        <div style={{ padding: '20px'}}>
              <TextField 
                label="Paste the URL for your decklist here (currently only Moxfield is supported):" 
                onChange={this.handleOnChange} 
                width="100%" 
                maxWidth="800px" 
                autoFocus={true} 
              />
              <div style={{ 'padding-top': '20px'}}>
                <Button onPress={this.handleOnPress} >
                  <Text>Submit</Text>
                </Button>
              </div>
        </div>
      )
  }
}