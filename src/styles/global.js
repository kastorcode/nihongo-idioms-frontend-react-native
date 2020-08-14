import styled from 'styled-components/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export const BigIcon = styled(FontAwesome5)`
	font-size: 32px;
	color: ${({theme}) => theme.buttons.sound.color};
	background-color: ${({theme}) => theme.buttons.sound.bg};
	padding: 14px 18px;
	border-radius: 8px;
	border-bottom-width: 4px;
	border-bottom-color: ${({theme}) => theme.buttons.sound.border};
	margin-bottom: 32px;
`;

const Button = styled.Text`
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	padding: 10px 16px;
`;

export const Button1 = styled(Button)`
	color: ${({theme}) => theme.buttons.one.color};
	background-color: ${({theme}) => theme.buttons.one.bg};
	border-radius: 2px;
`;

export const Button2 = styled(Button)`
	color: ${({theme}) => theme.buttons.two.color};
	background-color: ${({theme}) => theme.buttons.two.bg};
	border-bottom-width: 4px;
	border-bottom-color: ${({theme}) => theme.buttons.two.border};
	border-radius: 12px;
`;

export const HeaderLeftIcon = styled(FontAwesome5)`
	color: ${({theme}) => theme.header.icons};
	font-size: 18px;
	padding: 20px;
`;

export const InputBox = styled.View`
	width: 100%;
	align-items: center;
`;

export const ModulesList = styled.View`
	width: 100%;
`;

export const ModuleBox = styled.View`
	background-color: ${({theme}) => theme.bar.bg};
`;

export const ModuleText = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.bar.color};
	padding: 14px;
`;

const TextInput = styled.TextInput`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.input};
	flex: 1;
	padding: 0 12px;
	border-radius: 2px;
	border-color: ${({theme}) => theme.text};
	border-width: 2px;
`;

export const TextInput1 = styled(TextInput)`
	width: 100%;
	flex-basis: 48px;
	margin-bottom: 16px;
`;

export const TextArea = styled(TextInput)`
	width: 100%;
	flex-basis: 256px;
	padding: 12px;
	margin-bottom: 16px;
`;

export const PhraseList = styled.View`
	width: 100%;
`;

export const PhraseBox = styled.View`
	width: 100%;
	border: 4px solid ${({theme}) => theme.text};
	border-radius: 8px;
`;

export const OriginalPhrase = styled.View`
	border-bottom-width: 4px;
	border-bottom-color: ${({theme}) => theme.text};
`;

export const PhraseText = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.text};
	padding: 6px 8px;
`;

export const PhraseTranslation = styled.View``;

export const TitleIcon = styled(MaterialCommunityIcons)`
	font-size: ${({theme}) => theme.font.big};
`;