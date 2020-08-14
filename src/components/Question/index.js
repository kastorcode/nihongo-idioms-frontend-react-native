import React from 'react';
import { withTheme } from 'styled-components';
import ClickAnimation from '../ClickAnimation';
import { Container, Ask, Text, Reply, Icon } from './style';

function Question({ onPress, ask, replies, theme }) {
	return (
		<ClickAnimation
			onPress={onPress}
			style={{ marginBottom: 14 }}
		>
			<Container theme={theme}>
				<Ask>
					<Text theme={theme}>{ ask }</Text>
				</Ask>
				<Reply>
					<Icon name='comment-alt' theme={theme} />
					<Text theme={theme}>{ replies }</Text>
				</Reply>
			</Container>
		</ClickAnimation>
	);
}

export default withTheme(Question);