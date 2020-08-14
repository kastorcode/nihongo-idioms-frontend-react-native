import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const Text = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.big_minus_two};
	color: ${({theme}) => theme.translation};
`;

export const Icon = styled(MaterialCommunityIcons)`
	font-size: 32px;
	color: ${({theme}) => theme.translation};
`;