import React from 'react';
import styled from 'styled-components/native';
import ClickAnimation from '../../components/ClickAnimation';

export const MenuStyle = (theme) => ({
	width: '100%',
	borderWidth: 2,
	borderColor: theme.box.header,
  borderTopStartRadius: 8,
  borderTopEndRadius: 8,
  marginBottom: 20
});

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

export const CourseMenuTitle = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	color: ${({theme}) => theme.box.title};
	background-color: ${({theme}) => theme.box.header};
	padding: 6px 12px;
`;

export const Cards = styled.View`
	width: 100%;
	flex-direction: row;
	justify-content: space-between;
`;

export const Card = styled(ClickAnimation)`
	width: 46%;
	border: 4px solid ${({theme}) => theme.box.header};
  border-radius: 8px;
`;

export const CardHeader = styled.View`
	background-color: ${({theme}) => theme.box.header};
	height: 48px;
	justify-content: center;
	align-items: center;
`;

export const CardHeaderText = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: ${({theme}) => theme.font.normal};
	text-align: center;
	color: ${({theme}) => theme.box.title};
`;

export const CardBody = styled.View`
	height: 96px;
	justify-content: center;
	align-items: center;
`;

export const CardBodyText = styled.Text`
	font-family: ${({theme}) => theme.font.regular};
	font-size: 36px;
	color: ${({theme}) => theme.box.header};
`;