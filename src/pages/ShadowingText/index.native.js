import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-community/async-storage';
import { withTheme } from 'styled-components';
import { Audio } from 'expo-av';
import { useSelector } from 'react-redux';
import { baseURL, DIR_SHADOWING } from '../../config';
import api from '../../services/api';
import { BannerAds, InterstitialAds } from '../../utils/ads';
import HeaderRightIcons from '../../components/HeaderRightIcons';
import Loading from '../../components/Loading';
import Background from '../../components/Background';
import Container from '../../components/Container';
import NoInternet from '../../components/NoInternet';
import Title from '../../components/Title';
import ClickAnimation from '../../components/ClickAnimation';
import Word from '../../components/Word';
import { IconsBox, Icon, TextBox, Original, Translation } from './style';

function ShadowingText({ route, navigation, theme }) {
	const [isLoading, setIsLoading] = useState(true);
	const {
		ads,
		online,
		auth: { session },
		user:{ course }
	} = useSelector(store => store);
	const [show, setShow] = useState(false);
	const [text, setText] = useState([]);
	const [sound, setSound] = useState(null);
	const { item } = route.params;

	function handleDicio(word) {
		navigation.navigate('dictionary', { word });
	}

	function handleSound() {
		sound.getStatusAsync()
		.then(event => {
			if (event.isPlaying)
				sound.pauseAsync();
			else if (event.positionMillis == event.playableDurationMillis)
				sound.replayAsync();
			else
				sound.playAsync();
		});
	}

	function handleCaption() {
		setShow(!show);
	}

	async function getSound() {
	  Audio.Sound.createAsync(
	    { uri: `${DIR_SHADOWING}/${course.short}/${item.id}.mp3` }
	  )
	  .then(({ sound }) => {
	  	setSound(sound);
	  })
	  .catch(error => {
	  	FileSystem.downloadAsync(
				`${baseURL}/files/shadowing/${course.short}/${item.id}.mp3`,
				`${DIR_SHADOWING}/${course.short}/${item.id}.mp3`
			)
			.then(({ status }) => {
				if (status == 200)
					getSound();
			});
	  });
	}

	async function getShadowing() {
		const storage = await AsyncStorage.getItem(`@shadowing/${course.short}/${item.id}`);
		if (storage) {
			setText(JSON.parse(storage));
			setIsLoading(false);
			return;
		}

		try {
			const response = await api.get(`/getShadowing`, {
				params: { session, id: item.id }
			});
			const data = response.data.text.split('\\');
			setText(data);
			AsyncStorage.setItem(`@shadowing/${course.short}/${item.id}`, JSON.stringify(data));
		}
		catch (error) {
			alert('Aconteceu algum problema ao tentar pegar esse texto.');
		}
		finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (ads) {
			InterstitialAds();
		}
		getShadowing();
		getSound();
	}, []);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => ( <HeaderRightIcons handleSound={handleSound} handleCaption={handleCaption} /> )
		});
	}, [sound, show]);

	if (isLoading) {
		return (
			<Background>
				<Loading />
			</Background>
		);
	}
	else if (text.length) {
		return (
			<Background>
				<Container scroll={true}>
					<Title>{ item.title }</Title>

					{ ads ? (
						<BannerAds style={{marginBottom:32}} theme={theme} />
					) : null }

					<IconsBox>
						<ClickAnimation onPress={handleSound}>
							<Icon name='volume-up' theme={theme} />
						</ClickAnimation>
						<ClickAnimation onPress={handleCaption}>
							<Icon name='closed-captioning' theme={theme} />
						</ClickAnimation>
					</IconsBox>

					<TextBox>
					{ text.map((item, index) => (
						index % 2 ? (

							<Translation show={show} theme={theme}>{ item }</Translation>

						) : (

							<Original>
								{ item.split(' ').map((word, index) => (
									<Word onPress={() => handleDicio(word)}>
										{ word }
									</Word>
								)) }
							</Original>

						)
					)) }
					</TextBox>

					{ ads ? (
						<BannerAds style={{marginVertical:32}} theme={theme} />
					) : null }
				</Container>
			</Background>
		);
	}
	else {
		return (
			<Background>
				<NoInternet />
			</Background>
		);
	}
}

export default withTheme(ShadowingText);