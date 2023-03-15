import SQLite from 'react-native-sqlite-storage';

const sqlitDb = SQLite.openDatabase(
  {name: 'little_lemon'},
  () => {
    console.log('Database OPENED');
  },
  e => {
    console.log('Database ERROR', JSON.stringify(e));
  },
);

export default sqlitDb;
