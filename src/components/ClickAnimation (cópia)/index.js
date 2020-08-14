import React, { useState } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

export default function ClickAnimation({ style, onPress, children, loading=false }) {
	const [value, setValue] = useState([0, 2]);

	function animate() {
		setValue([value[1], value[0]]);
	}

	return(
		<View
			style={[style, {
		  	left: value[0],
		  	top: value[0],
		  	opacity: loading ? 0.6 : 1
			}]}
		>
			<TouchableWithoutFeedback
				onPressIn={animate}
				onPress={onPress}
				onPressOut={animate}
				disabled={loading}
			>
				<View>
					{children}
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
}