import React, { useState, useEffect } from 'react';
import { withTheme } from 'styled-components';
import { Image, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

function ImageBlock({ theme, uri }) {
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		Image.getSize(uri, (w, h) => {
			if (h > 375) {
				h = 375;
			}
			setWidth(w);
			setHeight(h);
		});
	}, []);

	return (
		<TouchableOpacity
			activeOpacity={0.6}
			onPress={() => WebBrowser.openBrowserAsync(uri)}
			style={{
				marginVertical: 12
			}}
		>
			<Image
				source={{ uri }}
				resizeMode='contain'
				style={{
					width,
					height,
					maxWidth: '100%',
					backgroundColor: theme.text
				}}
			/>
		</TouchableOpacity>
	);
}

export default withTheme(ImageBlock);