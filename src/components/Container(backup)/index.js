import React from 'react';
import { View } from './style';

export default function Container({ children, center=false }) {
	return (
		<View center={center}>
			{ children }
		</View>
	);
}