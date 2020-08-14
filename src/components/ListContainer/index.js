import React from 'react';
import { withTheme } from 'styled-components';
import { View } from './style';

function ListContainer({ style, children, theme }) {
	return (
		<View style={style}>
			{ children }
		</View>
	);
}

export default withTheme(ListContainer);