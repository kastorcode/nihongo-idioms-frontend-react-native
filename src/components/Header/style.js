import styled from 'styled-components/native';
import { FontAwesome5 } from '@expo/vector-icons';

export const Background = styled.View`
	width: 100%;
	height: 64px;
	background-color: ${({theme}) => theme.header.bg};
`;

export const Container = styled.View`
	width: 98%;
	height: 64px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	align-self: center;
`;

export const Logo = styled.Image`
	width: 48px;
	height: 48px;
`;

export const Icon = styled(FontAwesome5)`
	font-size: 24px;
	color: ${({theme}) => theme.header.icons};
	padding: 16px;
`;

export const MenuIcon = styled(FontAwesome5)`
	font-size: 20px;
	color: ${({theme}) => theme.header.menu.icons};
`;

export const MenuHeader = styled.View`
	align-items: center;
`;

export const UserName = styled.Text`
	font-family: ${({theme}) => theme.font.bold};
	font-size: 24px;
	color: ${({theme}) => theme.header.menu.text};
	margin-bottom: 12px;
`;

export const UserCourse = styled.Text`
	font-family: ${({theme}) => theme.font.bold};
	font-size: 20px;
	color: ${({theme}) => theme.header.menu.text};
`;

export const MenuBody = styled.View``;