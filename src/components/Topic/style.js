import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

export const View = styled.View``;

export const Text = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.text};
	padding: 8px 16px;
	line-height: 28px;
`;

export const Line = styled.View`
	width: 100%;
	height: 2px;
	background-color: #808080;
`;

export const Icon = styled(FontAwesome5)`
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.text};
	padding-left: 4px;
`;