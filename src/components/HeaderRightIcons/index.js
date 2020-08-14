import React from 'react';
import { TouchableOpacity } from 'react-native';
import { withTheme } from 'styled-components';
import { Container, Icon } from './style';

function HeaderRightIcons({ handleSound, handleCaption, theme }) {
	return (
		<Container>
			<TouchableOpacity activeOpacity={0.6} onPress={handleSound}>
				<Icon style={{ paddingRight: 10 }} name='volume-up' theme={theme} />
			</TouchableOpacity>
			<TouchableOpacity activeOpacity={0.6} onPress={handleCaption}>
				<Icon style={{ paddingLeft: 10 }} name='closed-captioning' theme={theme} />
			</TouchableOpacity>
		</Container>
	);
}

export default withTheme(HeaderRightIcons);