import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

export const Icon = styled(FontAwesome5)`
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.bar.color};
	background-color: ${({theme}) => theme.bar.bg};
	padding: 6px 18px;
	border-radius: 4px;
`;