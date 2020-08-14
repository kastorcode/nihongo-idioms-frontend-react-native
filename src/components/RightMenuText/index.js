import React, { useState } from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';

export default function RightMenuText({ theme, children, onPress }) {
	const [colors, setColors] = useState([theme.popup_menu.color, theme.popup_menu.bg]);

	function invertColors() {
		setColors([colors[1], colors[0]]);
	}

	return(
		<TouchableWithoutFeedback
			onPressIn={invertColors}
			onPress={onPress}
			onPressOut={invertColors}
		>
			<View>
				<Text style={{
					paddingHorizontal: 32,
					paddingVertical: 16,
					fontSize: 18,
					fontFamily: theme.font.regular,
					color: colors[0],
					backgroundColor: colors[1]
				}}>
					{children}
				</Text>
			</View>
		</TouchableWithoutFeedback>
	);
}