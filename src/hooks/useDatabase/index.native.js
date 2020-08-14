import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { DIR_DB, DB_NAME } from '../../config';

export default function useDatabase() {
	const { logged } = useSelector(store => store.auth);

	useEffect(() => {
		FileSystem.getInfoAsync(DIR_DB).then(({ exists }) => {
			if (!exists) {
				const db = SQLite.openDatabase(DB_NAME);
				db.transaction(tx => {
					tx.executeSql(`CREATE TABLE IF NOT EXISTS ${DB_NAME} (
						id INTEGER NOT NULL,
						course TEXT NOT NULL,
					  phrase TEXT NOT NULL,
					  translation TEXT NOT NULL,
					  revisions INTEGER NOT NULL DEFAULT 0,
					  factor INTEGER NOT NULL DEFAULT 1,
					  review DATE NOT NULL,
					  last_revision DATE DEFAULT '0000-00-00',
					  sync tinyINTEGER NOT NULL DEFAULT 1,
					  PRIMARY KEY (id, course)
					)`);
				});
			}
		});
	}, [logged]);
}