import React from 'react';
import { withTheme } from 'styled-components';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Menu, MenuOptions, MenuTrigger, withMenuContext } from 'react-native-popup-menu';
import Header from '../../components/Header';
import RightMenuText from '../../components/RightMenuText';
import Background from '../../components/Background';
import Container from '../../components/Container';
import ClickAnimation from '../../components/ClickAnimation';
import { Revisions, RevisionsBox1, RevisionsTitle, MenuStyle, MenuTriggerStyles, RevisionsIcon, VocabularyMenu, VocabularyButton } from './style';

function Vocabulary({ ctx, theme }) {
	const { quantity } = useSelector(store => store.revisions);
	const navigation = useNavigation();

	function handleRevisions() {
		if (quantity) {
			navigation.navigate('phrases', {
				training: false, day: null
			});
		}
		else {
			ctx.menuActions.openMenu('revisions');
		}
	}

	function navigate(training, day) {
		ctx.menuActions.closeMenu();
		navigation.navigate('phrases', {
			training, day
		});
	}

	return(
		<Background>
			<Header />

			<Container>
				<Revisions theme={theme}>
					<RevisionsBox1
						theme={theme}
						activeOpacity={0.9}
						onPress={handleRevisions}
					>
						<RevisionsTitle theme={theme}>Frases para Revisar</RevisionsTitle>
						<RevisionsTitle theme={theme}>{ quantity }</RevisionsTitle>
					</RevisionsBox1>

					<Menu name='revisions' style={MenuStyle}>
	          <MenuTrigger customStyles={MenuTriggerStyles}>
	          	<RevisionsIcon name='caret-down' theme={theme} />
	          </MenuTrigger>
	          <MenuOptions>
	            <RightMenuText onPress={() => navigate(true, 2)} theme={theme}>
	              Hoje
	            </RightMenuText>
	            <RightMenuText onPress={() => navigate(true, 1)} theme={theme}>
	              Ontem
	            </RightMenuText>
	            <RightMenuText onPress={() => navigate(true, 3)} theme={theme}>
	              Amanhã
	            </RightMenuText>
	            <RightMenuText onPress={() => navigate(true, 0)} theme={theme}>
	              Aleatório
	            </RightMenuText>
	          </MenuOptions>
	        </Menu>
				</Revisions>

				<VocabularyMenu>
					<ClickAnimation onPress={() => navigation.navigate('addphrase')}>
						<VocabularyButton theme={theme}>Adicionar Frase</VocabularyButton>
					</ClickAnimation>
					<ClickAnimation onPress={() => navigation.navigate('myphrases')}>
						<VocabularyButton theme={theme}>Minhas Frases</VocabularyButton>
					</ClickAnimation>
					<ClickAnimation onPress={() => navigation.navigate('searchphrases')}>
						<VocabularyButton theme={theme}>Buscar Frases</VocabularyButton>
					</ClickAnimation>
				</VocabularyMenu>
			</Container>
		</Background>
	);
}

export default withTheme(withMenuContext(Vocabulary));