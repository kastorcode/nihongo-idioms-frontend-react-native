import React from 'react';
import { withTheme } from 'styled-components';
import { View, Text } from './style';

function TwoColumns({ title, text, theme }) {
	return (
		<View>
			<Text theme={theme}>{ title }</Text>
			<Text theme={theme}>{ text }</Text>
		</View>
	);
}

export default withTheme(TwoColumns);