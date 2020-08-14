import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import { DIR_VOCABULARY, DIR_SHADOWING } from '../../config';

export default function useDirectories() {
	const { short } = useSelector(store => store.user.course);
	const options = {
		intermediates: true
	};

	useEffect(() => {
		if (short) {
			FileSystem.makeDirectoryAsync(`${DIR_VOCABULARY}/${short}`, options);
			FileSystem.makeDirectoryAsync(`${DIR_SHADOWING}/${short}`, options);
		}
	}, [short]);
}