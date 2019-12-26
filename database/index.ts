import Dexie from 'dexie';

const initDB = () => {
  const db = new Dexie('Gant');
  db.version(1).stores({
    user: '++id, name',
    companyData: '++id, dataType, dataId, bigData',
    userData: '++id, dataType, dataId, bigData',
    menu: '++id, parentResourceId,name,icon,leaf',
    file: '++id, data'
  });
  window['db'] = db
}

export { initDB }