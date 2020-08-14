import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import NoInternet from '../../components/NoInternet';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { TextInput1, Button1 } from '../../styles/global';
import ClickAnimation from '../../components/ClickAnimation';
import { InputBox, ClickAnimationStyle } from './style'

function AddPhrase({ theme }) {
	const { online } = useSelector(store => store);
	const { session } = useSelector(store => store.auth);
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
					params: { phrase, translation, session }
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