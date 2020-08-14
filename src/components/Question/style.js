import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

export const Container = styled.View`
	width: 100%;
	flex-direction: row;
	align-items: center;
	border: 4px solid ${({theme}) => theme.text};
	border-radius: 8px;
`;

export const Ask = styled.View`
	flex: 1;
	padding: 8px;
`;

export const Reply = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	padding: 8px;
`;

export const Text = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.text};
`;

export const Icon = styled(FontAwesome5)`
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.text};
	margin-right: 4px;
`;