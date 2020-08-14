import React, { useState, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import HeaderRightIcon from '../../components/HeaderRightIcon';
import Background from '../../components/Background';
import Loading from '../../components/Loading';
import NoInternet from '../../components/NoInternet';
import Container from '../../components/Container';
import ClickAnimation from '../../components/ClickAnimation';
import ListContainer from '../../components/ListContainer';
import { Button2 } from '../../styles/global';
import { QuestionBox, QuestionHeader, QuestionAvatar, Avatar, QuestionText, Title,
	QuestionTextBox, Text, QuestionBody, Content, ReplyBox, ReplyInput, Input, AnswerBox } from './style';

function ForumQuestion({ route, navigation, theme }) {
	navigation.setOptions({
		headerRight: () => ( <HeaderRightIcon name='comment-alt' onPress={scrollToReply} /> )
	});

	const [isLoading, setIsLoading] = useState(true);
	const { online } = useSelector(store => store);
	const { session } = useSelector(store => store.auth);
	const { avatar } = useSelector(store => store.user);

	const [waiting, setWaiting] = useState(false);
	const [reply, setReply] = useState('');
	const [question, setQuestion] = useState({});
	const [replies, setReplies] = useState([]);
	const [end, setEnd] = useState(false);
	const replyRef = useRef();

	const { id, ask } = route.params;

	function Answer({ avatar, name, date, reply }) {
		return (
			<AnswerBox theme={theme}>
				<QuestionHeader>
					<QuestionAvatar>
						<Avatar
							theme={theme}
			        source={{
			          uri: `https://${avatar}`
			        }}
			      />
					</QuestionAvatar>

					<QuestionText>
						<Text theme={theme}>{ name }</Text>
						<Text theme={theme}>{ date }</Text>
					</QuestionText>
				</QuestionHeader>

				<QuestionBody>
					<Content theme={theme}>{ reply }</Content>
				</QuestionBody>
			</AnswerBox>
		);
	}

	async function addReply() {
		if (waiting) return;

		if (reply.length < 20) {
			alert('O tamanho mínimo é de 20 caracteres.');
			return;
		}
		else if (reply.length > 2000) {
			alert('O tamanho máximo é de 2000 caracteres.');
			return;
		}

		setWaiting(true);

		try {
			await api.get(`/addReply`, {
				params: { id, reply, session }
			});
			setReply('');
		}
		catch (error) {
			alert('Não foi possível publicar esta resposta.');
		}
		finally {
			setWaiting(false);
		}
	}

	async function getReplies(scrolling = true) {
		if (waiting || (scrolling && end)) return;

		setWaiting(true);
		const last = scrolling ? replies[replies.length - 1].id : 0;

		try {
			const response = await api.get(`/getReplies`, {
				params: { id, last, session }
			});
			const { length } = response.data;
			if (!length || length < 20)
				setEnd(true);
			if (length)
				setReplies([...replies, ...response.data]);
		}
		catch (error) {
			if (online)
				alert('A busca por respostas fracassou.');
		}
		finally {
			setWaiting(false);
			if (isLoading) setIsLoading(false);
		}
	}

	async function getQuestion() {
		try {
			const response = await api.get(`/getQuestion`, {
				params: { id, session }
			});
			setQuestion(response.data);
			getReplies(false);
		}
		catch (error) {
			if (online)
				alert('Não foi possível acessar esta pergunta.');
		}
	}

	function scrollToReply() {
		replyRef.current.focus();
	}

	useEffect(() => {
		getQuestion();
	}, []);

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
				<Container scroll={true}>
					<QuestionBox theme={theme}>
						<QuestionHeader>
							<QuestionAvatar>
								<Avatar
									theme={theme}
					        source={{
					          uri: `https://${question.avatar}`
					        }}
					      />
							</QuestionAvatar>

							<QuestionText>
								<Title theme={theme}>{ ask }</Title>

								<QuestionTextBox>
									<Text theme={theme}>{ question.name }</Text>
									<Text theme={theme}>{ question.date }</Text>
								</QuestionTextBox>
							</QuestionText>
						</QuestionHeader>

						<QuestionBody>
							<Content theme={theme}>{ question.content }</Content>
						</QuestionBody>
					</QuestionBox>

					<ReplyBox>
						<QuestionAvatar>
							<Avatar
								theme={theme}
				        source={{
				          uri: `https://${avatar}`
				        }}
				      />
						</QuestionAvatar>

						<ReplyInput>
							<Input
								ref={replyRef}
					      theme={theme}
					      multiline={true}
					      textAlignVertical='top'
					      placeholder={`Deixar uma resposta...\nTags suportadas: <audio> <iframe> <img> <video>\nTamanho entre 20 e 2000 caracteres.`}
					      placeholderTextColor={theme.placeholder}
					      maxLength={2000}
					      value={reply}
					      onChangeText={value => setReply(value)}
					      returnKeyType='send'
					      onSubmitEditing={addReply}
				   	 	/>
				   	 	<ClickAnimation
				    		loading={waiting}
				    		onPress={addReply}
				    	>
								<Button2 theme={theme}>Publicar</Button2>
							</ClickAnimation>
						</ReplyInput>
					</ReplyBox>

					<ListContainer>
						<FlatList
			        data={replies}
			        onEndReachedThreshold={0.1}
			        onEndReached={getReplies}
			        keyExtractor={item => item.id}
			        renderItem={({item}) => (
			        	<Answer
			        		avatar={item.avatar}
			        		name={item.name}
			        		date={item.date}
			        		reply={item.reply}
			        	/>
			        )}
			      />
					</ListContainer>
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

export default withTheme(ForumQuestion);