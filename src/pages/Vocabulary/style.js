import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button1 } from '../../styles/global';

export const Revisions = styled.View`
	width: 100%;
	flex-direction: row;
	background-color: ${({theme}) => theme.revisions.bg};
	border: 4px solid ${({theme}) => theme.revisions.bg};
  border-radius: 8px;
  margin-bottom: 32px;
`;

export const RevisionsBox1 = styled.TouchableOpacity`
	width: 80%;
	flex-direction: row;
	justify-content: space-between;
	background-color: ${({theme}) => theme.revisions.box};
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
`;

export const RevisionsTitle = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.text};
	padding: 14px;
`;

export const MenuStyle = {
	flex: 1
};

export const MenuTriggerStyles = {
	triggerOuterWrapper: {
		flex: 1
	},
	triggerWrapper: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 7
	}
};

export const RevisionsIcon = styled(FontAwesome5)`
	font-size: 32px;
	color: ${({theme}) => theme.revisions.icon};
`;

export const VocabularyMenu = styled.View`
	width: 100%;
`;

export const VocabularyButton = styled(Button1)`
	text-align: center;
	margin-bottom: 16px;
`;