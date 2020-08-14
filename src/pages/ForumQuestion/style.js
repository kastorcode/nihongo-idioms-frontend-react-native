import styled from 'styled-components/native';

export const QuestionBox = styled.View`
	width: 100%;
	border: 4px solid ${({theme}) => theme.text};
	border-radius: 8px;
	padding: 8px;
`;

export const QuestionHeader = styled.View`
	width: 100%;
	flex-direction: row;
	align-items: center;
	margin-bottom: 16px;
`;

export const QuestionAvatar = styled.View`
	margin-right: 8px;
`;

export const Avatar = styled.Image`
	width: 56px;
	height: 56px;
	border-radius: 56px;
	background-color: ${({theme}) => theme.text};
`;

export const QuestionText = styled.View`
	flex: 1;
`;

export const Title = styled.Text`
	font-family: ${({theme}) => theme.font.bold};
	font-size: ${({theme}) => theme.font.normal_plus_two};
	color: ${({theme}) => theme.text};
	margin-bottom: 4px;
`;

export const QuestionTextBox = styled.View`
	flex-direction: row;
`;

export const Text = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal_minus_two};
	color: ${({theme}) => theme.text};
	margin-right: 8px;
`;

export const QuestionBody = styled.View``;

export const Content = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.text};
	text-align: justify;
	line-height: 24px;
`;

export const ReplyBox = styled.View`
	width: 100%;
	flex-direction: row;
	padding: 32px 0;
`;

export const ReplyInput = styled.View`
	flex: 1;
	flex-flow: wrap;
`;

export const Input = styled.TextInput`
	width: 100%;
	height: 90px;
	padding: 6px;
	margin-bottom: 8px;
	border: 2px solid ${({theme}) => theme.placeholder};
	border-radius: 8px;
	color: ${({theme}) => theme.text};
	background-color: transparent;
`;

export const AnswerBox = styled(QuestionBox)`
	border-width: 2px;
	margin-bottom: 20px;
`;