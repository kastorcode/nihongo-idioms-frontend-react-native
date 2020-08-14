import React from 'react';
import { ScrollView, View1, View2 } from './style';

export default function Container({ children, scroll=false, center=false }) {
	if (scroll) {
		return (
			<ScrollView>
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