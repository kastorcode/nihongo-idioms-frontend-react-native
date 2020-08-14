import React from 'react';
import { withTheme } from 'styled-components';
import ClickAnimation from '../ClickAnimation';
import { View, Text } from './style';

function ModuleBox({ onPress, theme, title }) {
	return (
		<ClickAnimation
  		style={{ width: '100%', marginBottom: 24 }}
  		onPress={onPress}
  	>
			<View theme={theme}>
				<Text theme={theme}>
					{ title }
				</Text>
			</View>
		</ClickAnimation>
	);
}

export default withTheme(ModuleBox);