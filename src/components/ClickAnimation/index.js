import React from 'react';
import { Pressable, View } from 'react-native';

export default function ClickAnimation({ style, onPress, children, loading=false }) {
	return (
		<Pressable
			onPress={onPress}
			disabled={loading}
			style={({pressed}) => [{
				left: pressed ? 2 : 0,
			  top: pressed ? 2 : 0
			}]}
		>
			<View
				style={[style, {
			  	opacity: loading ? 0.6 : 1
				}]}
			>
				{ children }
			</View>
		</Pressable>
	);
}