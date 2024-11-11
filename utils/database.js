
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('auth.db');

// Initialize database
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          'DROP TABLE IF EXISTS users;',
          [],
          () => {
        //    console.log('Old users table dropped');
          },
          (_, error) => {
         //   console.error('Error dropping old users table:', error);
          }
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            username TEXT UNIQUE, 
            password TEXT, 
            firstName TEXT, 
            lastName TEXT, 
            email TEXT, 
            contactNumber TEXT, 
            address TEXT, 
            profilePicture TEXT
          );`,
          [],
          () => {
         //   console.log('Database and table created successfully');
            resolve();
          },
          (_, error) => {
        //    console.error('Error creating table:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
    //  console.error('Transaction error:', error);
      reject(error);
    }
  });
};


export const registerUser = (userData) => {
  const { username, password, firstName, lastName, email, contactNumber, address, profilePicture } = userData;
  return new Promise((resolve, reject) => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM users WHERE username = ?',
          [username],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              reject(new Error('Username already exists'));
            } else {
              tx.executeSql(
                'INSERT INTO users (username, password, firstName, lastName, email, contactNumber, address, profilePicture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [username, password, firstName, lastName, email, contactNumber, address, profilePicture],
                (_, result) => {
              //    console.log('User registered successfully');
                  resolve(result);
                },
                (_, error) => {
              //    console.error('Error registering user:', error);
                  reject(error);
                }
              );
            }
          },
          (_, error) => {
        //    console.error('Error checking if user exists:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
     // console.error('Transaction error:', error);
      reject(error);
    }
  });
};



// database.js

export const loginUser = (username, password) => {
  //console.log('Attempting login with:', username, password);
  return new Promise((resolve, reject) => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM users WHERE username = ? AND password = ?',
          [username, password],
          (_, { rows: { _array } }) => {
         //   console.log('Login query result:', _array); 
            if (_array.length > 0) {
              resolve(_array[0]); 
            } else {
              reject(new Error('Invalid credentials'));
            }
          },
          (_, error) => {
           // console.error('Error logging in:', error);
            reject(error);
          }
        );
      });
    } catch (error) {
    //  console.error('Transaction error:', error);
      reject(error);
    }
  });
};

export const getUserData = (username) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            resolve(_array[0]); 
          } else {
            resolve(null); 
          }
        },
        (_, error) => {
        //  console.error('Error fetching user data:', error);
          reject(error);
        }
      );
    });
  });
};


export const updateUserData = (username, updatedData) => {
  return new Promise((resolve, reject) => {
    getUserData(username)
      .then(currentData => {
        if (!currentData) {
          reject(new Error('No user found to update'));
          return;
        }
        const updatedFields = {
          firstName: updatedData.firstName || currentData.firstName,
          lastName: updatedData.lastName || currentData.lastName,
          email: updatedData.email || currentData.email,
          contactNumber: updatedData.contactNumber || currentData.contactNumber,
          address: updatedData.address || currentData.address,
          profilePicture: updatedData.profilePicture || currentData.profilePicture,
        };
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE users SET firstName = ?, lastName = ?, email = ?, contactNumber = ?, address = ?, profilePicture = ? WHERE username = ?',
            [
              updatedFields.firstName,
              updatedFields.lastName,
              updatedFields.email,
              updatedFields.contactNumber,
              updatedFields.address,
              updatedFields.profilePicture,
              username,
            ],
            (_, result) => {
              if (result.rowsAffected > 0) {
                console.log('User data updated successfully');
                resolve(result);
              } else {
                reject(new Error('No user found to update'));
              }
            },
            (_, error) => {
              console.error('Error updating user data:', error);
              reject(error);
            }
          );
        });
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        reject(error);
      });
  });
};



