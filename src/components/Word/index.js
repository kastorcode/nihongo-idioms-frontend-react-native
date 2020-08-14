import React, { useState } from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import { withTheme } from 'styled-components';

function Word({ theme, onPress, children }) {
	const [value, setValue] = useState([theme.word.color, theme.word.active]);

	function animate() {
		setValue([value[1], value[0]]);
	}

	return(
		<TouchableWithoutFeedback
			onPressIn={animate}
			onPress={onPress}
			onPressOut={animate}
		>
			<View>
				<Text style={{
			  	color: value[0],
			  	fontFamily: theme.font.regular,
					fontSize: 24,
					marginRight: 5
				}}>
					{ children }
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);
}

export default withTheme(Word);