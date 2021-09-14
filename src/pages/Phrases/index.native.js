import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import * as SQLite from 'expo-sqlite';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { DB_NAME, baseURL, DIR_VOCABULARY } from '../../config';
import { backReview, subtractDate, calculateDate, nextReview, tagWords } from '../../utils';
import { BannerAds, InterstitialAds } from '../../utils/ads';
import { decrementRevisions } from '../../store/revisions/actions';
import { BigIcon } from '../../styles/global';
import Background from '../../components/Background';
import Container from '../../components/Container';
import Loading from '../../components/Loading';
import ClickAnimation from '../../components/ClickAnimation';
import Word from '../../components/Word';
import { Original, Translation, Buttons, ShowButton, ButtonsBox, AgainButton,
	TomorrowButton, OkButton, EmptyText } from './style';

function Phrases({ route, navigation, theme }) {
	const [isLoading, setIsLoading] = useState(true);
	const {
		ads,
		user: { auto, course, repro }
	} = useSelector(store => store);
	const [phrase, setPhrase] = useState(null);
	const [disabled, setDisabled] = useState(false);
	const yesterday = useRef(subtractDate(1));
	const today = useRef(calculateDate(0));
	const tomorrow = useRef(calculateDate(1));
	const last = useRef(0);
	const end = useRef(false);
	const db = useRef(SQLite.openDatabase(DB_NAME));
	const queue = useRef([]);
	const dispatch = useDispatch();
	const { training, day } = route.params;

	function handleDicio(word) {
		navigation.navigate('dictionary', { word });
	}

	const getSound = async (phrase_id) => {
		return new Promise(async (resolve, reject) => {
		  async function loadSound() {
		  	try {
			    const { sound, status } = await Audio.Sound.createAsync(
			      { uri: `${DIR_VOCABULARY}/${course.short}/${phrase_id}.mp3` }
			    );
			    return { sound, isLoaded: status.isLoaded };
			  }
			  catch (error) {
			  	return { sound: null, isLoaded: false };
			  }
		  }

		  const { sound, isLoaded } = await loadSound();
		  if (isLoaded) resolve(sound);

		  try {
			  await FileSystem.downloadAsync(
			    `${baseURL}/files/vocabulary/${course.short}/${phrase_id}.mp3`,
			    `${DIR_VOCABULARY}/${course.short}/${phrase_id}.mp3`
			  );
			}
			catch (error) {
				reject(new Error(`getSound Error`));
			}

			const { sound: audio } = await loadSound();
		  resolve(audio);
		});
	}

	async function checkEnd(length) {
		return new Promise(resolve => {
			if (!length || length < 10)
				end.current = true;
			resolve();
		});
	}

	async function getTrain() {
		return new Promise((resolve, reject) => {
			const { date, sql } = (() => {
				switch (day) {
					case 0: {
						return {
							date: null,
							sql: `SELECT id, phrase, translation FROM ${DB_NAME} WHERE course = ? AND id >= (abs(random()) % (SELECT max(id) FROM ${DB_NAME})) LIMIT 10`
						};
					}
					case 1: {
						return {
							date: yesterday.current,
							sql: `SELECT id, phrase, translation FROM ${DB_NAME} WHERE course = ? AND id > ? AND last_revision = ? LIMIT 10`
						};
					}
					case 2: {
						return {
							date: today.current,
							sql: `SELECT id, phrase, translation FROM ${DB_NAME} WHERE course = ? AND id > ? AND last_revision = ? LIMIT 10`
						};
					}
					case 3: {
						return {
							date: tomorrow.current,
							sql: `SELECT id, phrase, translation FROM ${DB_NAME} WHERE course = ? AND id > ? AND review = ? LIMIT 10`
						};
					}
					default: {
						reject(new Error(`Invalid training day`));
					}
				}
			})();

			db.current.transaction(tx => {
				tx.executeSql(sql, day ? [course.short, last.current, date] : [course.short],
					(transaction, result) => {
						const { length } = result.rows;
						if (day)
							checkEnd(length);

						if (length) {
							const array = result.rows._array;
							last.current = array[length - 1].id;
							queue.current = array.map(item => {
								item['repro'] = repro;
								item['phrase'] = item['phrase'].split(' ');
								item['sound'] = getSound(item['id']);
								return item;
							});
							if (!phrase) setPhrase(queue.current.shift());
						}

						resolve();
					},
					() => {
						alert('Falha ao tentar buscar frases.');
						reject();
					}
				);
			});
		});
	}

	async function getPhrases() {
		return new Promise((resolve, reject) => {
			db.current.transaction(tx => {
				const sql = `SELECT id, phrase, translation, revisions, factor FROM ${DB_NAME} WHERE id > ? AND course = ? AND review < ? LIMIT 10`;
				tx.executeSql(sql, [last.current, course.short, tomorrow.current],
					(transaction, result) => {
						const { length } = result.rows;
						checkEnd(length);
						if (length) {
							const array = result.rows._array;
							last.current = array[length - 1].id;
							queue.current = array.map(item => {
								item['repro'] = repro;
								item['phrase'] = item['phrase'].split(' ');
								item['sound'] = getSound(item['id']);
								return item;
							});
							if (!phrase) setPhrase(queue.current.shift());
						}
						resolve();
					},
					() => {
						alert('Falha ao tentar buscar frases.');
						reject();
					}
				);
			});
		});
	}

	function handleShow() {
		if (!phrase.repro)
			setDisabled(true);
		else
			alert('Você ainda não ouviu o áudio a quantidade mínima de vezes.');
	}

	function handleAgain() {
		setDisabled(false);
		queue.current.push(phrase);
		setPhrase(queue.current.shift());
	}

	function handleChoice(choice) {
		return new Promise((resolve, reject) => {
			setDisabled(false);
			let draft = phrase;
			setPhrase(queue.current.shift());

			if (training) {
				resolve();
			}
			else {
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

				db.current.transaction(tx => {
					const sql = `UPDATE ${DB_NAME} SET revisions = ?, factor = ?, review = ?, last_revision = ?, sync = ? WHERE id = ? AND course = ?`;
					tx.executeSql(sql, [draft.revisions, draft.factor, draft.review, today.current, 1, draft.id, course.short],
						() => {
							dispatch(decrementRevisions());
							resolve();
						},
						() => {
							alert('A atualização da última frase falhou.');
							reject();
						});
				});
			}
		});
	}

	function handleSound() {
		phrase.sound
		.then(object => object.getStatusAsync()
			.then(event => {
					if (event.isPlaying)
						object.pauseAsync();
					else if (event.positionMillis == event.playableDurationMillis)
						object.replayAsync();
					else {
						object.playAsync();
						if (phrase.repro) phrase.repro--;
					}
				}
			)
		)
		.catch(() => {
			alert('Não foi possível carregar esse áudio.');
		});
	}

	function playSoundWithLoop() {
		if (auto && phrase) {
			phrase.sound.then(object => {
				object.playAsync();
				if (phrase.repro) phrase.repro--;
				object.setOnPlaybackStatusUpdate(event => {
					if (event.didJustFinish && phrase.repro) {
						object.replayAsync();
						if (phrase.repro) phrase.repro--;
					}
				});
			});
		}
	}

	async function handlePhrases() {
		if (!end.current && !queue.current.length) {
			if (training)
				await getTrain();
			else
				await getPhrases();
		}
		setIsLoading(false);
	}

	useEffect(() => {
		if (ads) {
			InterstitialAds();
		}
		if (training) {
			navigation.setOptions({ title: 'Treino' });
		}
	}, []);

	useEffect(() => {
		playSoundWithLoop();
		handlePhrases();
	}, [phrase]);

	if (isLoading) {
		return (
			<Background>
				<Loading />
			</Background>
		);
	}
	else if (phrase) {
		return (
			<Background>
				<Container center={true}>
					<ClickAnimation onPress={handleSound}>
						<BigIcon name='volume-up' theme={theme} />
					</ClickAnimation>
					<Original>
						{ phrase.phrase.map(word => (
							<Word onPress={() => handleDicio(word)} theme={theme}>
								{ word }
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
				</Container>
			</Background>
		);
	}
	else {
		return (
			<Background>
				<Container center={true}>
					<EmptyText theme={theme}>Nada para revisar</EmptyText>
				</Container>
				{ ads ? (
					<BannerAds theme={theme} />
				) : null }
			</Background>
		);
	}
}

export default withTheme(Phrases);