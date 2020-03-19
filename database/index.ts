import Dexie from 'dexie';
import { userData, smartTableData } from './mock'
const initDB = async () => {
  const db = new Dexie('Gant');
  db.version(1).stores({
    user: '++id, name',
    companyData: '++id, dataType, dataId, bigData',
    userData: '++id, dataType, dataId, bigData',
    menu: '++id, parentResourceId,name,icon,leaf',
    file: '++id, data',
    smarttable: '++id, name, age, sex, view, domain, codeRate, popularIndex, hobby, motto,birth,cellphone,price,address,href,email'
  });
  window['db'] = db

  //初始化mock数据到本地数据库

  if (await db['userData'].count() === 0) {
    await db['userData'].bulkAdd(userData)
  }

  if (await db['smarttable'].count() === 0) {
    await db['smarttable'].bulkAdd(smartTableData)
  }


}

export { initDB }