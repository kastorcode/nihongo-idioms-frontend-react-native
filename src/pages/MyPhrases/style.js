import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button1 } from '../../styles/global';

export const PhraseBox = styled.View`
	width: 100%;
	margin-bottom: 12px;
	border: 2px solid ${({theme}) => theme.phrase.border};
`;

export const PhraseHeader = styled.View`
	width: 100%;
	border-bottom-width: 2px;
	border-bottom-color: ${({theme}) => theme.phrase.border};
	padding: 6px;
`;

export const PhraseText = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.text};
`;

export const PhraseBody = styled.View`
	flex-direction: row;
	width: 100%;
	padding: 6px;
	align-items: center;
`;

export const PhraseDate = styled.View`
	width: 33.3%;
	align-items: flex-start;
`;

export const PhraseReviews = styled.View`
	width: 33.3%;
	align-items: center;
`;

export const PhraseDelete = styled.View`
	width: 33.3%;
	align-items: flex-end;
`;

export const PhraseDeleteIcon = styled(FontAwesome5)`
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.text};
`;