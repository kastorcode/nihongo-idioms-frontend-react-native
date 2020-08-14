import React from 'react';
import { TouchableOpacity } from 'react-native';
import { withTheme } from 'styled-components';
import { Icon } from './style';

function HeaderRightIcon({ name, onPress, theme }) {
	return (
		<TouchableOpacity activeOpacity={0.6} onPress={onPress}>
			<Icon name={name} theme={theme} />
		</TouchableOpacity>
	);
}

export default withTheme(HeaderRightIcon);