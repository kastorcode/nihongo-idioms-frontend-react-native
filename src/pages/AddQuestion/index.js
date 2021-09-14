import React, { useState, useRef } from 'react';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import Background from '../../components/Background';
import NoInternet from '../../components/NoInternet';
import Container from '../../components/Container';
import Avatar from '../../components/Avatar';
import ClickAnimation from '../../components/ClickAnimation';
import { InputBox, TextInput1, TextArea, Button1 } from '../../styles/global';

function AddQuestion({ theme }) {
	const {
		online,
		auth: { session },
		user: { avatar, course }
	} = useSelector(store => store);

	const [isLoading, setIsLoading] = useState(false);
	const [question, setQuestion] = useState('');
	const [content, setContent] = useState('');

	const questionRef = useRef();
	const contentRef = useRef();

	async function handleSubmit() {
		if (question.length < 18 || question.length > 132) {
			alert('A pergunta precisa ter entre 18 e 132 caracteres.');
			return;
		}
		if (content.length < 18 || content.length > 2000) {
			alert('O conteúdo da sua pergunta tem que estar entre 18 e 2000 caracteres.');
			return;
		}

		setIsLoading(true);

		try {
			await api.get(`/addQuestion`, {
				params: { session, course: course.short, question, content }
			});
			setQuestion('');
			setContent('');
			questionRef.current.focus();
		}
		catch (error) {
			alert('A inclusão da pergunta falhou.');
		}
		finally {
			setIsLoading(false);
		}
	}

	if (online) {
		return (
			<Background>
				<Container>
					<Avatar
						source={avatar}
						height={64}
						style={{ marginBottom: 16 }}
					/>

					<InputBox>
						<TextInput1
				      theme={theme}
				      onChangeText={value => setQuestion(value)}
				      maxLength={132}
				      placeholder='Pergunta (Entre 18 e 132 caracteres)'
				      placeholderTextColor={theme.placeholder}
				      value={question}
				      returnKeyType='next'
				      ref={questionRef}
				      onSubmitEditing={() => contentRef.current.focus()}
				    />
				    <TextArea
				      theme={theme}
				      multiline={true}
				      textAlignVertical='top'
				      onChangeText={value => setContent(value)}
				      maxLength={2000}
				      placeholder={`Tamanho entre 18 e 2000 caracteres\n<a>áudio</a>\n<l>link</l>\n<p>imagem</p>`}
				      placeholderTextColor={theme.placeholder}
				      value={content}
				      returnKeyType='send'
				      ref={contentRef}
				      onSubmitEditing={handleSubmit}
				    />
				    <ClickAnimation
				    	loading={isLoading}
				    	onPress={handleSubmit}
				    	style={{ width: '50%' }}
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

export default withTheme(AddQuestion);