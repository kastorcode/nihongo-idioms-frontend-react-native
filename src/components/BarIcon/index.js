import React from 'react';
import { withTheme } from 'styled-components';
import ClickAnimation from '../ClickAnimation';
import { Icon } from './style';

function BarIcon({ loading, onPress, name, theme }) {
	return (
		<ClickAnimation
			loading={loading}
			onPress={onPress}
			style={{ marginRight: 12 }}
		>
			<Icon name={name} theme={theme} />
		</ClickAnimation>
	);
}

export default withTheme(BarIcon);