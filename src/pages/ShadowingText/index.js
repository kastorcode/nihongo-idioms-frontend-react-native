import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { withTheme } from 'styled-components';
import { Audio } from 'expo-av';
import { useSelector } from 'react-redux';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { baseURL } from '../../config';
import api from '../../services/api';
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
	const [isLoading, setIsLoading] = useState(false);
	const { online } = useSelector(store => store);
	const { course } = useSelector(store => store.user);
	const { session } = useSelector(store => store.auth);
	const [show, setShow] = useState(false);
	const [text, setText] = useState([]);
	const [sound] = useState(new Audio.Sound());
	const { item } = route.params;

	function handleDicio(word) {
		navigation.navigate('dictionary', { word });
	}

	function handleKeyboard(key) {
		switch(key) {
			case 'space': case 'p': {
				handleSound();
				break;
			}

			case 'enter': case 'c': {
				handleCaption();
				break;
			}
		}
	}

	function handleSound() {
		sound.getStatusAsync()
		.then(event => {
			if (event.isPlaying)
				sound.pauseAsync();
			else
				sound.playAsync();
		});
	}

	function handleCaption() {
		setShow(!show);
	}

	async function getShadowing() {
		const storage = await AsyncStorage.getItem(`@shadowing/${course.short}/${item.id}`);
		if (storage) {
			setText(JSON.parse(storage));
			return;
		}

		setIsLoading(true);
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
		getShadowing();
		sound.loadAsync(`${baseURL}/files/shadowing/${course.short}/${item.id}.mp3`);
	}, []);

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => ( <HeaderRightIcons handleSound={handleSound} handleCaption={handleCaption} /> )
		});
	}, [show]);

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
					<KeyboardEventHandler
						handleKeys={['all']}
						onKeyEvent={key => handleKeyboard(key)}
					/>

					<Title>{ item.title }</Title>

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