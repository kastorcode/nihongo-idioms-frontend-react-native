import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { withTheme } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuTrigger, MenuOptions, MenuOption, renderers } from 'react-native-popup-menu';
import api from '../../services/api';
import { changeUserCourse } from '../../store/user/actions';
import { offlineMessage } from '../../utils';
import Header from '../../components/Header';
import Background from '../../components/Background';
import Container from '../../components/Container';
import { MenuStyle, MenuTriggerStyles, MenuOptionsStyles,
	CourseMenuTitle, Cards, Card, CardHeader, CardHeaderText, CardBody,
	CardBodyText } from './style';

function UserMain({ theme }) {
	const { online, revisions, notifications } = useSelector(store => store);
	const { session } = useSelector(store => store.auth);
	const { course, myCourses } = useSelector(store => store.user);
	const dispatch = useDispatch();
	const navigation = useNavigation();

	async function changeCourse(course) {
		dispatch(changeUserCourse(course));

		if (online) {
			api.get(`/changeCourse`, {
				params: { session, course: course.short }
			})
			.catch(() => {
				alert('A mudança de curso falhou.');
			});
		}
	}

  return (
  	<Background>
	  	<Header />

	  	<Container center={true}>
		  	<Menu renderer={renderers.Popover} style={MenuStyle(theme)}>
		  		<CourseMenuTitle theme={theme}>Curso</CourseMenuTitle>
	      	<MenuTrigger customStyles={MenuTriggerStyles(theme)} text={course.full} />
		      <MenuOptions customStyles={MenuOptionsStyles(theme)}>
		      	<FlatList
			        data={myCourses}
			        keyExtractor={item => item.short}
			        renderItem={({item}) => (
			        	<MenuOption onSelect={() => changeCourse(item)} text={item.full} />
			        )}
			      />
		      </MenuOptions>
		    </Menu>

		    <Cards>
		    	<Card onPress={() => navigation.navigate('vocabulary')} theme={theme}>
		    		<CardHeader theme={theme}>
		    			<CardHeaderText theme={theme}>Frases para Revisar</CardHeaderText>
		    		</CardHeader>
		    		<CardBody>
		    			<CardBodyText theme={theme}>{ revisions.quantity }</CardBodyText>
		    		</CardBody>
		    	</Card>
		    	<Card onPress={() => navigation.navigate('notifications')} theme={theme}>
		    		<CardHeader theme={theme}>
		    			<CardHeaderText theme={theme}>Notificações</CardHeaderText>
		    		</CardHeader>
		    		<CardBody>
		    			<CardBodyText theme={theme}>{ notifications.quantity }</CardBodyText>
		    		</CardBody>
		    	</Card>
		    </Cards>
		  </Container>
	  </Background>
  );
}

export default withTheme(UserMain);