import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import * as SQLite from 'expo-sqlite';
import { DB_NAME } from '../../config';
import { calculateDate } from '../../utils';
import useUpdateEffect from '../useUpdateEffect';
import { updateRevisions } from '../../store/revisions/actions';

export default function useRevisions() {
  const [loaded, setLoaded] = useState(false);
  const { revisions } = useSelector(store => store);
	const { course } = useSelector(store => store.user);
	const dispatch = useDispatch();

  const updateRevisionsStorage = () => {
    return new Promise(resolve => {
      AsyncStorage.getItem('@revisions')
      .then(storage => {
        if (storage) {
          storage = JSON.parse(storage);
        }
        if (revisions != storage) {
          AsyncStorage.setItem('@revisions', JSON.stringify(revisions));
        }
        resolve();
      });
    });
  }

	const checkRevisions = () => {
    return new Promise(resolve => {
      AsyncStorage.getItem('@revisions')
      .then(storage => {
        if (storage) storage = JSON.parse(storage);
        const today = calculateDate(0);
        if (!storage || today > storage.last) {
          const db = SQLite.openDatabase(DB_NAME);
          db.transaction(tx => {
            const sql = `SELECT id FROM ${DB_NAME} WHERE course = ? AND review < ?`;
            const tomorrow = calculateDate(1);
            tx.executeSql(sql, [course.short, tomorrow],
              (transaction, result) => {
                dispatch(updateRevisions(result.rows.length, today));
                resolve();
              }
            );
          });
        }
        else {
          dispatch(updateRevisions(storage.quantity, storage.last));
          resolve();
        }
      });
    });
	}

  const clearRevisions = () => {
    return new Promise(resolve => {
      AsyncStorage.removeItem('@revisions')
      .then(() => {
        setLoaded(false);
        resolve();
      });
    });
  }

  useEffect(() => {
    EventRegister.on('clearRevisions', clearRevisions);
  }, []);

  useEffect(() => {
    if (revisions.last != '0000-00-00') {
      updateRevisionsStorage();
    }
  }, [revisions]);

  useUpdateEffect(() => {
    clearRevisions();
  }, [course]);

	if (!loaded && course) {
    setLoaded(true);
		checkRevisions();
	}

  return loaded;
}