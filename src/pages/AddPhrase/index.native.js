import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { InterstitialAds, FixedAds } from '../../utils/ads';
import NoInternet from '../../components/NoInternet';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { TextInput1, Button1 } from '../../styles/global';
import ClickAnimation from '../../components/ClickAnimation';
import { InputBox, ClickAnimationStyle } from './style'

function AddPhrase({ theme }) {
	const {
		ads,
		online,
		auth: { session },
		user: { course }
	} = useSelector(store => store);
	const phraseRef = useRef();
	const translationRef = useRef();

	const [phrase, setPhrase] = useState('');
	const [translation, setTranslation] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit() {
		if (phrase.length < 14 || phrase.length > 100) {
			alert('A frase precisa ter entre 14 e 100 caracteres.');
		}
		else if (translation.length < 14 || translation.length > 100) {
			alert('A tradução precisa ter entre 14 e 100 caracteres.');
		}
		else {
			setLoading(true);
			try {
				await api.get(`/addPhrase`, {
					params: { session, course: course.short, phrase, translation }
				});
				setPhrase('');
				setTranslation('');
				phraseRef.current.focus();
			}
			catch (error) {
				alert('Falha ao adicionar frase.');
			}
			finally {
				setLoading(false);
			}
		}
	}

	useEffect(() => {
		if (ads) {
			InterstitialAds();
		}
	}, []);

	if (online) {
		return (
			<Background>
				<Container>
					<InputBox>
						<TextInput1
				      theme={theme}
				      onChangeText={text => setPhrase(text)}
				      maxLength={100}
				      placeholder='Frase'
				      placeholderTextColor={theme.placeholder}
				      value={phrase}
				      returnKeyType='next'
				      ref={phraseRef}
				      onSubmitEditing={() => translationRef.current.focus()}
				    />
				    <TextInput1
				      theme={theme}
				      onChangeText={text => setTranslation(text)}
				      maxLength={100}
				      placeholder='Tradução'
				      placeholderTextColor={theme.placeholder}
				      value={translation}
				      returnKeyType='send'
				      ref={translationRef}
				      onSubmitEditing={handleSubmit}
				    />
				    <ClickAnimation
				    	loading={loading}
				    	onPress={handleSubmit}
				    	style={ClickAnimationStyle}
				    >
				    	<Button1 theme={theme}>Adicionar</Button1>
				    </ClickAnimation>
			    </InputBox>
				</Container>
				{ ads ? (
					<FixedAds theme={theme} />
				) : null }
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

export default withTheme(AddPhrase);