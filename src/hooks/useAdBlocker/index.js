import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';

export default function useAdBlocker() {
	const [blocked, setBlocked] = useState(false);
	const { online } = useSelector(store => store);
	const { premium } = useSelector(store => store.auth);

	const updateBlocker = () => {
		setBlocked(true);
	}

	useEffect(() => {
		if (!premium && online) {
			api.get('/files/js/prebid-ads.js')
			.then(response => {
				if (response.data != 'const passed = true;') {
					updateBlocker();
				}
			})
			.catch(() => {
				updateBlocker();
			});
		}
	}, [online]);

	return blocked;
}