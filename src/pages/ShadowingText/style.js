import styled from 'styled-components/native';
import { BigIcon } from '../../styles/global';

export const IconsBox = styled.View`
	flex-direction: row;
	width: 100%;
`;

export const Icon = styled(BigIcon)`
	margin-left: 20px;
`;

export const TextBox = styled.View`
	width: 100%;
`;

export const Original = styled.View`
	width: 100%;
	flex-direction: row;
	flex-wrap: wrap;
	margin-bottom: 4px;
`;

export const Translation = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.big_minus_two};
	color: ${({theme}) => theme.translation};
	opacity: ${({show}) => show ? 1 : 0};
	margin-bottom: 14px;
`;