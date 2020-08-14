import styled from 'styled-components/native';

export const MenuStyle = (theme) => ({
	width: '100%',
	borderWidth: 2,
	borderColor: theme.box.header,
  borderTopStartRadius: 8,
  borderTopEndRadius: 8,
  marginBottom: 20
});

export const MenuTitle = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.box.title};
	background-color: ${({theme}) => theme.box.header};
	padding: 6px 12px;
`;

export const MenuTriggerStyles = (theme) => ({
	triggerText: {
		padding: 12,
		fontFamily: theme.font.regular,
		fontSize: 18,
		color: theme.box.header
	}
});

export const MenuOptionsStyles = (theme) => ({
	optionText: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		fontFamily: theme.font.regular,
		fontSize: 18,
		color: theme.popup_menu.text
	}
});