import React from 'react';
import {Text, Flex} from '@adobe/react-spectrum'
import PropTypes from "prop-types";
import './Preview.css';

export class Preview extends React.Component {

    static propTypes = {
        deck: PropTypes.object,
      }

      render() {
        const avatarUrl = this?.props?.deck?.data?.authorAvatarUrl;
        // const authorUrl = this?.props?.deck?.data?.authorProfileUrl;
        const title = this?.props?.deck?.data?.title;
        const salt = this?.props?.deck?.data?.salt;
        const author = this?.props?.deck?.data?.author;

        return (
            <Flex direction="column">
                <Flex direction="row">
                    <img src={avatarUrl} height="100px" alt="avatar" />
                    <Flex direction="column">
                        <Text UNSAFE_className="TitleText">{title}</Text>
                        <Text UNSAFE_className='AuthorText'>{author}</Text>
                    </Flex>
                </Flex>
                Score: {salt}
            </Flex>
        )
      }
}