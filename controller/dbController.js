const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { tables } = require('./../model/tables')
const dbPath = path.join(__dirname, './../mr_plumber_shop.sqlite');

let db

module.exports = {
    initDatabase: () => {
       db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.log('Error opening database:', err.message);
            } else {
                console.log('Connected to SQLite database')
                module.exports.createTables();
            }
       })
    },
 
    createTables: () => {
        for (let i = 0; i < tables.length; i++) {
            const table = tables[i]
            const columns = table.fields.map(field => `${field.name} ${field.type}`).join(', ');
          const sql = `CREATE TABLE IF NOT EXISTS ${table.name} (id INTEGER PRIMARY KEY AUTOINCREMENT, ${columns})`;
          db.run(sql, (err) => {
                if (err) {
                    console.log(`Error creating table ${table.name}:`, err.message);
                } else {
                    console.log(`Table ${table.name} created successfully`);
                }
            })
        }
    },

    insertData: (table, data, callback) => {
        const keys = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
  
        const sql = `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`;
  
        db.run(sql, values, function (err) {
           if (err) {
              console.error(`Error inserting data into ${table}:`, err.message);
              callback(err);
           } else {
              console.log(`Data inserted into ${table} successfully, Row ID: ${this.lastID}`);
              callback(null, this.lastID);  // Return the last inserted ID
           }
        });
    },

    fetchAll: (table, callback) => {
        const sql = `SELECT * FROM ${table}`;
  
        db.all(sql, [], (err, rows) => {
           if (err) {
                console.error(`Error fetching data from ${table}:`, err.message);
                callback(err);
           } else {
                console.log(`Data fetched from ${table} successfully`);
                callback(null, rows)
           }
        });
    },

    updateData: (table, data, id, callback) => {
        const updates = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data).concat(id);  // Append ID at the end for WHERE clause
  
        const sql = `UPDATE ${table} SET ${updates} WHERE id = ?`;
  
        db.run(sql, values, function (err) {
           if (err) {
              console.error(`Error updating data in ${table}:`, err.message);
              callback(err);
           } else {
              console.log(`Data in ${table} updated successfully, Rows affected: ${this.changes}`)
              callback(null, this.changes)
           }
        });
    },
    
    closeDatabase: () => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.log('Error closing database:', err.message);
                } else {
                    console.log('Database connection closed');
                }
            });
        }
    }
 };