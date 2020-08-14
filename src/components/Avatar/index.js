import React from 'react';
import { View, Image } from 'react-native';
import { withTheme } from 'styled-components';

function Avatar({ style, source, theme, height=56 }) {
	return (
		<View style={style}>
			<Image
				source={{
			  	uri: `https://${source}`
			  }}
			  style={{
			  	width: height,
					height: height,
					borderRadius: height,
					backgroundColor: theme.text
			  }}
			/>
		</View>
	);
}

export default withTheme(Avatar);