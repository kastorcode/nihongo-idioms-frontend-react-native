import React from 'react';
import { Platform } from 'react-native';
import { ScrollView, View1, View2 } from './style';

export default function Container({ children, scroll=false, center=false }) {
	if (scroll) {
		return (
			<ScrollView showsVerticalScrollIndicator={Platform.OS == 'web'}>
				<View1>
					<View2 center={center}>
						{ children }
					</View2>
				</View1>
			</ScrollView>
		);
	}
	else {
		return (
			<View2 center={center}>
				{ children }
			</View2>
		);
	}
}