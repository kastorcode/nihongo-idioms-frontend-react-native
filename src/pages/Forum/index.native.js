import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector } from 'react-redux';
import { BannerAds } from '../../utils/ads';
import api from '../../services/api';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import NoInternet from '../../components/NoInternet';
import Container from '../../components/Container';
import Title from '../../components/Title';
import SearchBox from '../../components/SearchBox';
import ButtonsBar from '../../components/ButtonsBar';
import BarIcon from '../../components/BarIcon';
import ListContainer from '../../components/ListContainer';
import Question from '../../components/Question';

function Forum({ navigation, theme }) {
	const [isLoading, setIsLoading] = useState(true);
	const {
		ads,
		online,
		auth: { session },
		user: { course }
	} = useSelector(store => store);
	const [fetching, setFetching] = useState(false);
	const [end, setEnd] = useState(false);
	const [scroll, setScroll] = useState('getQuestions');
	const [text, setText] = useState('');
	const [title, setTitle] = useState('Fórum');
	const [questions, setQuestions] = useState([]);
	const { navigate } = navigation;

	function goTo(id, ask) {
		navigate('forumquestion', { id, ask });
	}

	function handleEndScroll() {
		switch(scroll) {
			case 'getMyQuestions': {
				getMyQuestions();
				break;
			}

			case 'getQuestions': {
				getQuestions();
				break;
			}

			case 'searchQuestions': {
				searchQuestions();
				break;
			}
		}
	}

	function checkEnd(length) {
		if (!length || length < 20) {
			setEnd(true);
		}
	}

	async function searchQuestions(scrolling = true) {
		if (fetching || (scrolling && end)) return;

		setFetching(true);

		if (scroll != 'searchQuestions') {
			setTitle('Pesquisa');
			setScroll('searchQuestions');
			setEnd(false);
		}

		const last = scrolling ? questions[questions.length - 1].id : 0;

		try {
			const response = await api.get(`/searchQuestions`, {
				params: { session, course: course.short, last, text }
			});
			const { length } = response.data;
			checkEnd(length);
			if (length) {
				const { data } = response;
				if (scrolling)
					setQuestions([...questions, ...data]);
				else
					setQuestions(data);
			}
			else {
				setQuestions([]);
			}
		}
		catch (error) {
			alert('Por algum motivo, a pesquisa deu errado.');
		}
		finally {
			setFetching(false);
		}
	}

	async function getMyQuestions(scrolling = true) {
		if (fetching || (scrolling && end)) return;

		if (scroll != 'getMyQuestions') {
			setTitle('Minhas Perguntas');
			setScroll('getMyQuestions');
			setEnd(false);
		}

		setFetching(true);
		const last = scrolling ? questions[questions.length - 1].id : 0;

		try {
			const response = await api.get(`/getMyQuestions`, {
				params: { session, course: course.short, last }
			});
			const { length } = response.data;
			checkEnd(length);
			if (length) {
				const { data } = response;
				if (scrolling)
					setQuestions([...questions, ...data]);
				else
					setQuestions(data);
			}
		}
		catch (error) {
			alert('Erro ao puxar suas perguntas.');
		}
		finally {
			setFetching(false);
		}
	}

	async function getQuestions(scrolling = true) {
		if (fetching || (scrolling && end)) return;

		setFetching(true);
		const last = scrolling ? questions[questions.length - 1].id : 0;

		try {
			const response = await api.get(`/getQuestions`, {
				params: { session, course: course.short, last }
			});
			const { length } = response.data;
			checkEnd(length);
			if (length) {
				const { data } = response;
				setQuestions([...questions, ...data]);
			}
		}
		catch (error) {
			if (online) alert('Algo deu errado.');
		}
		finally {
			setFetching(false);
			if (isLoading) setIsLoading(false);
		}
	}

	function renderItem({ item, index }) {
		const question = () => <Question
			ask={item.question}
    	replies={item.replies}
    	onPress={() => goTo(item.id, item.question)}
    />;

		if (ads && !(index % 3)) {
			return [<BannerAds style={{marginBottom:16}} theme={theme} />, question()];
		}
		else {
			return question();
		}
	}

	useEffect(() => {
		getQuestions(false);
	}, [online]);

	if (isLoading) {
		return (
			<Background>
				<Header />
				<Loading />
			</Background>
		);
	}
	else if (online) {
		return (
			<Background>
				<Header />

				<Container scroll={true}>
					<Title>{ title }</Title>

					<SearchBox
						loading={fetching}
						value={text}
						onChangeText={value => setText(value)}
						onSubmitEditing={() => searchQuestions(false)}
					/>

					<ButtonsBar>
						<BarIcon
							loading={fetching}
							name='plus-circle'
							onPress={() => navigate('addquestion')}
						/>
						<BarIcon
							loading={fetching}
							name='question-circle'
							onPress={() => getMyQuestions(false)}
						/>
						<BarIcon
							loading={fetching}
							name='clipboard-list'
							onPress={() => goTo(2, 'Sugestões')}
						/>
						<BarIcon
							loading={fetching}
							name='bug'
							onPress={() => goTo(1, 'Bugs')}
						/>
					</ButtonsBar>

					<ListContainer>
						<FlatList
			        data={questions}
			        onEndReachedThreshold={0.1}
			        onEndReached={handleEndScroll}
			        keyExtractor={item => item.id}
			        renderItem={renderItem}
			      />
					</ListContainer>
				</Container>
			</Background>
		);
	}
	else {
		return (
			<Background>
				<Header />
				<NoInternet />
			</Background>
		);
	}
}

export default withTheme(Forum);