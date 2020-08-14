import React from 'react';
import { withTheme } from 'styled-components';
import { Switch } from 'react-native';
import { View, Text } from './style';

function Toggle({ title, onPress, theme, loading, value }) {
	return (
		<View theme={theme}>
			<Text theme={theme}>
				{ title }
			</Text>
			<Switch
				disabled={loading}
        thumbColor={theme.toggle.color}
        trackColor={{ false: theme.toggle.color, true: theme.toggle.bg }}
        onValueChange={onPress}
        value={value}
      />
		</View>
	);
}

export default withTheme(Toggle);