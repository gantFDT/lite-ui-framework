import Dexie from 'dexie';
import { userData } from './mock'
const initDB = async () => {
  const db = new Dexie('Gant');
  db.version(1).stores({
    user: '++id, name',
    companyData: '++id, dataType, dataId, bigData',
    userData: '++id, dataType, dataId, bigData',
    menu: '++id, parentResourceId,name,icon,leaf',
    file: '++id, data'
  });
  window['db'] = db
  const dataCount = await db['userData'].count()
  //初始化mock数据到本地数据库
  if(dataCount===0){
    await db['userData'].bulkAdd(userData)
  }
}

export { initDB }