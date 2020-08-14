import styled from 'styled-components/native';
import { Button1 } from '../../styles/global';

export const View = styled.View`
	flex-direction: row;
	width: 100%;
	align-items: center;
	margin-bottom: 12px;
`;

export const TextInput = styled.TextInput`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.input};
	flex: 1;
	height: 42px;
	padding: 0 12px;
	border-radius: 2px;
	border-color: ${({theme}) => theme.text};
	border-width: 2px;
`;

export const Button = styled(Button1)`
	margin-left: 12px;
`;