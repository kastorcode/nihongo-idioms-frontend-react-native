import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import themes from '../../styles/themes';

export default function useTheme() {
	const [loaded, setLoaded] = useState(false);
	const { theme } = useSelector(store => store.user);

	useEffect(() => {
		if (theme)
			setLoaded(themes.dark);
		else
			setLoaded(themes.light);
	}, [theme]);

	return loaded;
}