import React from 'react';
import { View } from 'react-native';
import Startapp, { Banner } from 'rn-startapp-simple';

export function BannerAds({ style, theme }) {
	return (
		<View style={[style, { width: '100%', height: 51, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: theme.background }]}>
			<Banner style={{ width: 320, height: 50 }} />
		</View>
	);
}

export async function InterstitialAds() {
	Startapp.showInterstitial();
}

export function FixedAds({ theme }) {
	return (
		<View style={{ position: 'absolute', bottom: 0, width: '100%', height: 51, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: theme.background }}>
			<Banner style={{ width: 320, height: 50 }} />
		</View>
	);
}