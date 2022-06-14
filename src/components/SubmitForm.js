import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@adobe/react-spectrum";
import { Button } from "@adobe/react-spectrum";
import {Text} from '@adobe/react-spectrum'

// import { Bell } from "@adobe/react-spectrum"

export class SubmitForm extends React.Component {

  currentDeckUrl = ``;

  static propTypes = {
    listSubmitHandler: PropTypes.func,
  }

  handleOnPress = (event) => {
    this.props.listSubmitHandler(this.currentDeckUrl);
  }

  handleOnChange = (val) => {
    this.currentDeckUrl = val;
  }
  

  render() {
      return (
        <div style={{width: "800px", display: "inline-block", height: '100%'}}>
          <TextField label="Paste your moxfield deck like here" onChange={this.handleOnChange} width="100%" />
          <div style={{ 'padding-top': '20px'}}>
            <Button onPress={this.handleOnPress} >
              <Text>Submit</Text>
            </Button>
          </div>
        </div>
      )
  }
}