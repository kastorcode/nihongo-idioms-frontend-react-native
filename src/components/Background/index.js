import React from 'react';
import { withTheme } from 'styled-components';
import { SafeAreaView } from './style';

function Background({ theme, children }) {
	return (
		<SafeAreaView theme={theme}>
			{ children }
		</SafeAreaView>
	);
}

export default withTheme(Background);