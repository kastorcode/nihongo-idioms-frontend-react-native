import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button1 } from '../../styles/global';

export const Original = styled.View`
	flex-direction: row;
	margin-bottom: 16px;
`;

export const Translation = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.big_minus_two};
	color: ${({theme}) => theme.translation};
	margin-bottom: 32px;
	opacity: ${({disabled}) => disabled ? 1 : 0};
`;

export const Buttons = styled.View`
	width: 100%;
	max-width: 342px;
`;

export const ShowButton = styled(Button1)`
	width: 100%;
	justify-content: center;
	text-align: center;
	padding: 12px 0;
	display: ${({disabled}) => disabled ? 'none' : 'flex'};
`;

export const ButtonsBox = styled.View`
	flex-direction: row;
	justify-content: space-between;
	display: ${({disabled}) => disabled ? 'flex' : 'none'};
`;

const choiceButtons = styled.Text`
	width: 106px;
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	text-align: center;
	color: ${({theme}) => theme.buttons.color};
	padding: 12px 0px;
	border-radius: 2px;
`;

export const AgainButton = styled(choiceButtons)`
	background-color: ${({theme}) => theme.buttons.again};
`;

export const TomorrowButton = styled(choiceButtons)`
	background-color: ${({theme}) => theme.buttons.tomorrow};
`;

export const OkButton = styled(choiceButtons)`
	background-color: ${({theme}) => theme.buttons.ok};
`;

export const EmptyText = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.big};
	color: ${({theme}) => theme.translation};
`;