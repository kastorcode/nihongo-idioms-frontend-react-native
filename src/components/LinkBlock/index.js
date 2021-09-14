import React, { useRef } from 'react';
import 'react-native-url-polyfill/auto';
import { withTheme } from 'styled-components';
import { TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Button1 } from '../../styles/global';

function LinkBlock({ theme, uri }) {
	const link = useRef(new URL(uri));

	return (
		<TouchableOpacity
			activeOpacity={0.6}
			onPress={() => WebBrowser.openBrowserAsync(link.current.href)}
			style={{
				width: '100%',
				marginVertical: 12
			}}
		>
			<Button1
				theme={theme}
				style={{
					fontFamily: theme.font.bold
				}}
			>
				<FontAwesome5 name='link' size={18} color={theme.buttons.one.color} />
				{` `}
				{ link.current.host.toUpperCase() }
			</Button1>
		</TouchableOpacity>
	);
}

export default withTheme(LinkBlock);