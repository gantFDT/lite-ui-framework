import Dexie from 'dexie';

//
// Declare Database
//
// export const initDB = () => {
//   const db = new Dexie("Gant")
//   db.version(1).stores({ user: "++id,name" })

// db.transaction('rw', db['friends'], async () => {

//   // Make sure we have something in DB:
//   if ((await db['friends'].where({ name: 'Josephine' }).count()) === 0) {
//     const id = await db['friends'].add({ name: "Josephine", age: 21 })
//     alert(`Addded friend with id ${id}`)
//   }

//   // Query:
//   const youngFriends = await db['friends'].where("age").below(25).toArray()

//   // Show result:
//   alert("My young friends: " + JSON.stringify(youngFriends))

// }).catch(e => {
//   alert(e.stack || e);
// })
// }

const initDB = () => {
  const db = new Dexie('Gant');
  // Declare tables, IDs and indexes
  db.version(1).stores({
    user: '++id, name',
    companyData: '++id, dataType,dataId,bigData',
    userData: '++id, dataType,dataId,bigData',
    menu: '++id,parentResourceId,name,icon,leaf'
  });
  window['db'] = db
}
export { initDB }