import React, { useState, useEffect } from 'react';
import { withTheme } from 'styled-components';
import { TouchableOpacity } from 'react-native';
import { View, Text, Line, Icon } from './style';

function Topic({ route, topic, title, text, theme, icon=false }) {
	const [display, setDisplay] = useState();

	function setTheDisplay() {
		setDisplay(route == topic ? 'flex' : 'none');
	}

	function toggleDisplay() {
		setDisplay(display == 'none' ? 'flex' : 'none');
	}

	useEffect(() => {
		setTheDisplay();
	}, [route]);

	return (
		<View>
			<Line />
			<TouchableOpacity onPress={toggleDisplay} activeOpacity={0.6}>
				<View>
					<Text theme={theme}>{ title }</Text>
				</View>
			</TouchableOpacity>

			<View style={{ display:display }}>
				<Line />
				<Text theme={theme}>
					{ text }
					{ icon && ( <Icon name={icon} theme={theme} /> ) }
				</Text>
			</View>
		</View>
	);
}

export default withTheme(Topic);