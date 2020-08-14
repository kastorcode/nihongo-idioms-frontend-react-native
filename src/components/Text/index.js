import React from 'react';
import { View } from 'react-native';
import { withTheme } from 'styled-components';
import { StyledText } from './style';

function Text({ theme, children }) {
	return (
		<View>
			<StyledText theme={theme}>
				{ children }
			</StyledText>
		</View>
	);
}

export default withTheme(Text);