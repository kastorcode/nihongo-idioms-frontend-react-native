import styled from 'styled-components/native';

export const ExplanationBox = styled.View`
	width: 100%;
	padding-bottom: 40px;
`;

export const ExplanationText = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal_plus_two};
	color: ${({theme}) => theme.text};
	line-height: 32px;
	text-align: justify;
`;