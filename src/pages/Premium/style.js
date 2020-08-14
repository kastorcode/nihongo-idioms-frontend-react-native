import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

export const ButtonsBox = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: flex-end;
	margin: 12px 0;
`;

export const Icon = styled(FontAwesome5)`
	font-size: ${({theme}) => theme.font.normal_plus_two};
	color: ${({theme}) => theme.buttons.two.color};
`;