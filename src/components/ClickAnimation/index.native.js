import React from 'react';
import { Pressable, View } from 'react-native';

export default function ClickAnimation({ style, onPress, children, loading=false }) {
	return (
		<Pressable
			onPress={onPress}
			disabled={loading}
			style={({ pressed }) => [style, {
				left: pressed ? 2 : 0,
			  top: pressed ? 2 : 0,
			  opacity: loading ? 0.6 : 1
			}]}
		>
			<View>
				{ children }
			</View>
		</Pressable>
	);
}