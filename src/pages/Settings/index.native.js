import React, { useState, useEffect } from 'react';
import { withMenuContext } from 'react-native-popup-menu';
import { withTheme } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import { offlineMessage } from '../../utils';
import { BannerAds } from '../../utils/ads';
import { changeAds } from '../../store/ads/actions';
import { changeUserName, changeUserTheme, changeUserAuto, changeUserRepro, changeUserGender, addMyCourses } from '../../store/user/actions';
import Background from '../../components/Background';
import Header from '../../components/Header';
import Container from '../../components/Container';
import Title from '../../components/Title';
import Avatar from '../../components/Avatar';
import TwoColumns from '../../components/TwoColumns';
import ModuleBox from '../../components/ModuleBox';
import SearchBox from '../../components/SearchBox';
import Toggle from '../../components/Toggle';
import MenuPopover from '../../components/MenuPopover';

function Settings({ ctx, navigation, theme }) {
	const {
		ads,
		online,
		user,
		auth: { premium, session }
	} = useSelector(store => store);
	const [waiting, setWaiting] = useState(false);
	const [userName, setUserName] = useState(user.name);
	const [userTheme, setUserTheme] = useState(user.theme);
	const [userRepro, setUserRepro] = useState(user.repro.toString());
	const [userGender, setUserGender] = useState(getGender(user.gender));
	const [userAds, setUserAds] = useState();

	const [reproList] = useState([{short:'0', full:'0'}, {short:'1', full:'1'}, {short:'2', full:'2'}, {short:'3', full:'3'}, {short:'4', full:'4'}, {short:'5', full:'5'}]);
	const [genderList] = useState([{short:'M', full:'Masculino'}, {short:'F', full:'Feminino'}]);
	const [courseList, setCourseList] = useState([{}]);

	const dispatch = useDispatch();

	function getGender(gender) {
		if (gender == 'M')
			return 'Masculino';
		else
			return 'Feminino';
	}

	async function clearOfflineCache() {
		await AsyncStorage.clear();
		EventRegister.emit('updateLoginStorage');
		alert('O cache está limpo!');
	}

	async function changeName() {
		if (!online) {
			offlineMessage();
			return;
		}
		if (userName.length < 4) {
			alert('O tamanho mínimo do nome é de 4 caracteres.');
			return;
		}
		if (userName.length > 20) {
			alert('O tamanho máximo do nome é de 20 caracteres.');
			return;
		}

		setWaiting(true);

		try {
			await api.get(`/changeName`, {
				params: { session, name: userName }
			});
			dispatch(changeUserName(userName));
			alert('Nome atualizado com sucesso.');
		}
		catch (error) {
			alert('A troca de nome falhou.');
		}
		finally {
			setWaiting(false);
		}
	}

	async function changeTheme() {
		dispatch(changeUserTheme());
		if (!online) return;

		try {
			await api.get(`/changeTheme`, {
				params: { session, theme: !user.theme }
			});
		}
		catch (error) {
			alert('A troca do tema falhou.');
		}
	}

	async function changeAuto() {
		dispatch(changeUserAuto());
		if (!online) return;

		try {
			await api.get(`/changeAuto`, {
				params: { session, auto: !user.auto }
			});
		}
		catch (error) {
			alert('Falha ao mudar a reprodução automática.');
		}
	}

	async function changeRepro(repro) {
		dispatch(changeUserRepro(repro.short));
		setUserRepro(repro.short);
		if (!online) return;

		try {
			await api.get(`/changeRepro`, {
				params: { session, repro: repro.short }
			});
		}
		catch (error) {
			alert('A mudança do número de reproduções falhou.');
		}
	}

	async function changeGender(gender) {
		if (!online) {
			offlineMessage();
			return;
		}
		dispatch(changeUserGender(gender.short));
		setUserGender(gender.full);

		try {
			await api.get(`/changeGender`, {
				params: { session, gender: gender.short }
			});
		}
		catch (error) {
			alert('A escolha do sexo fracassou.');
		}
	}

	async function addCourse(course) {
		if (!online) {
			offlineMessage();
			return;
		}

		try {
			await api.get(`/addCourse`, {
				params: { session, course: course.short }
			});
			dispatch(addMyCourses(course));
			alert(`Curso de ${course.full} adicionado!`);
		}
		catch (error) {
			alert(`Falhamos ao tentar adicionar o curso de ${course.full}.`);
		}
	}

	function handleAds() {
		if (premium) {
			if (online) {
				const bool = userAds;
				setUserAds(!bool);

				api.get(`/changeAds`, {
					params: { session, bool }
				})
				.then(() => {
					dispatch(changeAds(bool));
				})
				.catch(() => {
					dispatch(changeAds(true));
					alert('Não foi possível processar sua solicitação.');
					setUserAds(false);
				});
			}
			else {
				offlineMessage();
			}
		}
	}

	async function getCourses() {
		if (!online) {
			offlineMessage();
			ctx.menuActions.closeMenu();
			return;
		}
		if (courseList[0].short) {
			return;
		}

		setCourseList([{ full: 'Carregando...' }]);
		try {
			const response = await api.get(`/getCourses`, {
				params: { session }
			});
			setCourseList(response.data);
		}
		catch (error) {
			setCourseList([{ full: 'Não carregado' }]);
			alert('Não foi possível pegar a lista de cursos.');
		}
	}

	useEffect(() => {
		setUserAds(!ads);
	}, [ads]);

	return (
		<Background>
			<Header />

			<Container scroll={true}>
				<Title>Configurações</Title>

				{ ads ? (
					<BannerAds style={{marginBottom:32}} theme={theme} />
				) : null }

				<Avatar
					source={user.avatar}
					height={64}
					style={{ marginBottom: 16 }}
				/>

				<TwoColumns
					title='Você está:'
					text={online ? 'Online' : 'Offline'}
				/>

				<ModuleBox
      		title={`Tutorial`}
      		onPress={() => navigation.navigate('tutorial', { topic:'' })}
      	/>
      	<ModuleBox
      		title={`Premium`}
      		onPress={() => navigation.navigate('premium')}
      	/>
      	<ModuleBox
      		title={`Limpar cache offline`}
      		onPress={clearOfflineCache}
      	/>

      	<SearchBox
      		loading={waiting}
      		maxLength={20}
      		value={userName}
      		text='Mudar'
      		onChangeText={value => setUserName(value)}
      		onSubmitEditing={changeName}
      		style={{marginBottom:24}}
      	/>

      	<Toggle
      		loading={waiting}
      		value={user.theme}
      		onPress={changeTheme}
      		title='Tema escuro'
      	/>
      	<Toggle
      		loading={waiting}
      		value={user.auto}
      		onPress={changeAuto}
      		title='Reprodução automática de áudio'
      	/>

      	<MenuPopover
      		title='Reprodução mínima'
      		text={userRepro}
      		data={reproList}
      		onSelect={value => changeRepro(value)}
      	/>
      	<MenuPopover
      		title='Meu gênero'
      		text={userGender}
      		data={genderList}
      		onSelect={value => changeGender(value)}
      	/>
      	<MenuPopover
      		title='Adicionar curso'
      		text={user.course.full}
      		data={courseList}
      		onOpen={getCourses}
      		onSelect={value => addCourse(value)}
      	/>
      	{ premium ? (
	      	<Toggle
	      		loading={waiting}
	      		value={userAds}
	      		onPress={handleAds}
	      		title='Remover anúncios'
	      	/>
      	) : null }
			</Container>

			{ ads ? (
				<BannerAds theme={theme} />
			) : null }
		</Background>
	);
}

export default withTheme(withMenuContext(Settings));