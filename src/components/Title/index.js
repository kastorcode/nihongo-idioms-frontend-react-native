import React from 'react';
import { withTheme } from 'styled-components';
import { View, Text } from './style';

function Title({ theme, children }) {
	return (
		<View>
			<Text theme={theme}>
				{ children }
			</Text>
		</View>
	);
}

export default withTheme(Title);