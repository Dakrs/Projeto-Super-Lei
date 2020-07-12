import { openDatabase } from 'react-native-sqlite-storage';
 const  errorCB = (err) =>  {
  console.log("SQL Error: " + err);
}

const successCB = () => {
  console.log("SQL executed fine");
}


export const selectAll = (callback) => {
  console.log('-----')
db.transaction(function(txn){
 
    txn.executeSql(
      'Select * from todos',
      [],
      (tx, res) => {
        console.log(tx)
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS todos', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',
              []
            );
            callback([])
          }
        callback(res.rows.raw(0))
      },
      (tx,err) => {
          console(err)
          callback([])
      },
      (tx,suc) => {
        console(suc)
        callback([])
    },
      )
      }
    )
}

export const insertTodo = (_id, name,origin,description,priority,callback) => {
  db.transaction(function(tx){
    tx.executeSql(
      'Insert Into todos (_id,name,origin,description,priority,state) values (?,?,?,?,?,?)',
      [_id,name,origin,description,priority,0],
      (tx, results) => {
        callback(results)
      }
    )
  })
}

export const cancelTodo = (_id,callback) => {
  db.transaction(function(tx){
    tx.executeSql(
      'update todos set state=0  where _id = ?',
      [_id],
      (tx, results) => {
        callback(results)
      }
    )
  })
}

export const confrimTodo = (_id,callback) => {
  db.transaction(function(tx){
    tx.executeSql(
      'update todos set state=1  where _id = ?',
      [_id],
      (tx, results) => {
        callback(results)
      }
    )
  })
}








