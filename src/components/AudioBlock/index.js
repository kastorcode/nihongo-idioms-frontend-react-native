import React from 'react';
import { withTheme } from 'styled-components';
import { TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
import { BigIcon } from '../../styles/global';

function AudioBlock({ theme, uri }) {
	const audio = () => {
		return new Promise((resolve, reject) => {
			const sound = new Audio.Sound();
			sound.loadAsync(uri)
			.then(() => resolve(sound))
			.catch(reject);
		});
	}

	const handleAudio = () => {
		audio().then(object => object.getStatusAsync().then(event => {
			if (event.isPlaying) {
				object.pauseAsync();
			}
			else {
				object.playAsync();
			}
		}))
		.catch(() => {
			alert('Não foi possível carregar esse áudio.');
		});
	}

	return (
		<TouchableOpacity
			activeOpacity={0.6}
			onPress={handleAudio}
			onLongPress={() => WebBrowser.openBrowserAsync(uri)}
			style={{
				width: 72,
				height: 67,
				marginVertical: 12,
				alignSelf: 'center'
			}}
		>
			<BigIcon name='volume-up' theme={theme} />
		</TouchableOpacity>
	);
}

export default withTheme(AudioBlock);