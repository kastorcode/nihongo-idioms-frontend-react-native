import React, { useState, useEffect } from 'react';
import { withTheme } from 'styled-components';
import { TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useSelector, useDispatch } from 'react-redux';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import { baseURL } from '../../config';
import api from '../../services/api';
import { backReview, calculateDate, nextReview, tagWords } from '../../utils';
import { decrementRevisions } from '../../store/revisions/actions';
import { BigIcon } from '../../styles/global';
import Background from '../../components/Background';
import Container from '../../components/Container';
import Loading from '../../components/Loading';
import NoInternet from '../../components/NoInternet';
import ClickAnimation from '../../components/ClickAnimation';
import Word from '../../components/Word';
import { Original, Translation, Buttons, ShowButton, ButtonsBox, AgainButton,
	TomorrowButton, OkButton, EmptyText } from './style';

let queue;

function Phrases({ route, navigation, theme }) {
	const [isLoading, setIsLoading] = useState(true);
	const { online } = useSelector(store => store);
	const { session } = useSelector(store => store.auth);
	const { auto, course, repro } = useSelector(store => store.user);
	const [phrase, setPhrase] = useState(null);
	const [disabled, setDisabled] = useState(false);
	const [today] = useState(calculateDate(0));
	const [last, setLast] = useState(0);
	const dispatch = useDispatch();
	const { training, day } = route.params;

	function handleDicio(word) {
		navigation.navigate('dictionary', { word });
	}

	function handleKeyboard(key) {
		switch(key) {
			case 'space': case 'p': {
				handleSound();
				break;
			}

			case 'up': case 'w': {
				handleShow();
				break;
			}

			case 'left': case 'a': {
				if (!phrase.repro)
					handleAgain();
				break;
			}

			case 'down': case 's': {
				if (!phrase.repro)
					handleChoice(1);
				break;
			}

			case 'right': case 'd': {
				if (!phrase.repro)
					handleChoice(2);
				break;
			}
		}
	}

	const getSound = (phrase_id) => {
		return new Promise((resolve, reject) => {
			const sound = new Audio.Sound();
			sound.loadAsync(`${baseURL}/files/vocabulary/${course.short}/${phrase_id}.mp3`)
			.then(() => resolve(sound))
			.catch(reject);
		});
	}

	async function getPhrases() {
		if (queue.length) return;
		try {
			const response = training ? 
				await api.get(`/train`, {
					params: { session, course: course.short, day, last }
				}) : 
				await api.get(`/getPhrases`, {
					params: { session, course: course.short, last }
				});

			if (response.data.length) {
				setLast(response.data[response.data.length - 1].phrase_id);

				queue = response.data.map(item => {
					item['repro'] = repro;
					item['phrase'] = item['phrase'].split(' ');
					item['sound'] = getSound(item.phrase_id);
					return item;
				});

				if (!phrase) setPhrase(queue.shift());
			}
		}
		catch (error) {
			alert('Falha ao tentar buscar frases.');
		}
		finally {
			setIsLoading(false);
		}
	}

	function handleShow() {
		if (!phrase.repro)
			setDisabled(true);
		else
			alert('Você ainda não ouviu o áudio a quantidade mínima de vezes.');
	}

	function handleAgain() {
		setDisabled(false);
		queue.push(phrase);
		setPhrase(queue.shift());
	}

	async function handleChoice(choice) {
		setDisabled(false);
		let draft = phrase;
		setPhrase(queue.shift());
		if (training) return;

		switch (choice) {
			case 1: {
				draft = backReview(draft);
				break;
			}

			case 2: {
				draft = nextReview(draft);
				break;
			}
		}

		draft['revisions']++;
		draft['last_revision'] = today;
		delete draft['phrase'];
		delete draft['translation'];
		delete draft['repro'];
		delete draft['sound'];

		try {
			await api.get(`/phrase`, {
				params: { session, course: course.short, phrase: draft }
			});
			dispatch(decrementRevisions());
		}
		catch (error) {
			alert('A atualização da última frase falhou.');
		}
	}

	function handleSound() {
		phrase.sound.then(sound => {
			sound.getStatusAsync().then(event => {
				if (event.isPlaying) {
					sound.pauseAsync();
				}
				else {
					sound.playAsync()
					.catch(() => alert('Não foi possível carregar esse áudio.'));
					if (phrase.repro) phrase.repro--;
				}
			});
		});
	}

	function playSoundWithLoop() {
		if (auto && phrase) {
			phrase.sound.then(sound => {
				sound.playAsync();
				if (phrase.repro) phrase.repro--;
				sound.setOnPlaybackStatusUpdate(event => {
					if (event.didJustFinish && phrase.repro) {
						sound.playAsync();
						if (phrase.repro) phrase.repro--;
					}
				});
			});
		}
	}

	useEffect(() => {
		queue = [];

		if (training) {
			navigation.setOptions({ title: 'Treino' });
		}
	}, []);

	useEffect(() => {
		getPhrases();
		playSoundWithLoop();
	}, [phrase]);

	if (isLoading) {
		return (
			<Background>
				<Loading />
			</Background>
		);
	}
	else if (online) {
		return (
			<Background>
				<Container center={true}>
				{ phrase ? ( <>
					<KeyboardEventHandler
						handleKeys={['all']}
						onKeyEvent={key => handleKeyboard(key)}
					/>

					<ClickAnimation onPress={handleSound}>
						<BigIcon name='volume-up' theme={theme} />
					</ClickAnimation>
					<Original>
						{ phrase.phrase.map(word => (
							<Word onPress={() => handleDicio(word)} theme={theme}>
								{word}
							</Word>
						)) }
					</Original>
					<Translation
						theme={theme}
						disabled={disabled}
					>
						{ phrase.translation }
					</Translation>
					
					<Buttons>
						<TouchableOpacity onPress={handleShow} activeOpacity={0.6}>
							<ShowButton theme={theme} disabled={disabled}>Mostrar Resposta</ShowButton>
						</TouchableOpacity>

						<ButtonsBox disabled={disabled}>
							<ClickAnimation onPress={handleAgain}>
								<AgainButton theme={theme}>Repetir</AgainButton>
							</ClickAnimation>
							{ !training && (
								<ClickAnimation onPress={() => handleChoice(1)}>
									<TomorrowButton theme={theme}>Amanhã</TomorrowButton>
								</ClickAnimation>
							) }
							<ClickAnimation onPress={() => handleChoice(2)}>
								<OkButton theme={theme}>Ok</OkButton>
							</ClickAnimation>
						</ButtonsBox>
					</Buttons>
				</> ) : (
					<EmptyText theme={theme}>Nada para revisar</EmptyText>
				) }
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

export default withTheme(Phrases);