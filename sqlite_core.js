const sqlite3 = require('sqlite3').verbose();

module.exports = {
    create: function(PATH, TABLE, DATAs) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(PATH, (err) => {
                if (err) reject(`데이터베이스 연결 오류: ${err.message}`);
            });

            let query = `CREATE TABLE IF NOT EXISTS ${TABLE} (idx INTEGER PRIMARY KEY AUTOINCREMENT`;
            for (const variable in DATAs) {
                query += `,\n${variable}`;
                for (const constraint of DATAs[variable]) {
                    query += ` ${constraint}`;
                }
            }
            query += ")";
            
            db.run(query, (err) => {
                if (err) {
                    db.close();
                    reject(`테이블 생성 오류: ${err.message}`);
                } else {
                    console.log('테이블이 생성되었습니다.');
                    db.close((err) => {
                        if (err) console.error(`데이터베이스 종료 오류: ${err.message}`);
                        resolve();
                    });
                }
            });
        });
    },

    write: function(PATH, TABLE, DATAs) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(PATH, (err) => {
                if (err) reject(`데이터베이스 연결 오류: ${err.message}`);
            });

            const columns = ['idx', ...Object.keys(DATAs)];
            const placeholders = columns.map(() => '?').join(',');
            const query = `INSERT INTO ${TABLE} (${columns.join(',')}) VALUES (${placeholders})`;
            const data = [null, ...Object.values(DATAs)];

            db.run(query, data, function(err) {
                if (err) {
                    db.close();
                    reject(`데이터 삽입 오류: ${err.message}`);
                } else {
                    console.log(`새 데이터가 추가되었습니다. ID: ${this.lastID}`);
                    db.close((err) => {
                        if (err) console.error(`데이터베이스 종료 오류: ${err.message}`);
                        resolve(this.lastID);
                    });
                }
            });
        });
    },

    read: function(PATH, QUERY) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(PATH, (err) => {
                if (err) reject(`데이터베이스 연결 오류: ${err.message}`);
            });

            db.all(QUERY, [], (err, rows) => {
                if (err) {
                    db.close();
                    reject(`쿼리 실행 오류: ${err.message}`);
                } else {
                    db.close((err) => {
                        if (err) console.error(`데이터베이스 종료 오류: ${err.message}`);
                        resolve(rows);
                    });
                }
            });
        });
    },

    update: function(PATH, TABLE, SET, WHERE) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(PATH, (err) => {
                if (err) reject(`데이터베이스 연결 오류: ${err.message}`);
            });
            const setClause = Object.entries(SET)
                .map(([key, value]) => `${key} = ?`)
                .join(', ');
            const whereClause = Object.entries(WHERE)
                .map(([key, value]) => `${key} = ?`)
                .join(' AND ');
            
            const query = `UPDATE ${TABLE} SET ${setClause} WHERE ${whereClause}`;
            const values = [...Object.values(SET), ...Object.values(WHERE)];

            db.run(query, values, function(err) {
                if (err) {
                    db.close();
                    reject(`데이터 업데이트 오류: ${err.message}`);
                } else {
                    console.log(`${this.changes}개의 행이 업데이트되었습니다.`);
                    db.close((err) => {
                        if (err) console.error(`데이터베이스 종료 오류: ${err.message}`);
                        resolve(this.changes);
                    });
                }
            });
        });
    },

    delete: function(PATH, TABLE, WHERE) {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database(PATH, (err) => {
                if (err) reject(`데이터베이스 연결 오류: ${err.message}`);
            });

            let whereClause = '';
            let values = [];

            if (WHERE && Object.keys(WHERE).length > 0) {
                whereClause = 'WHERE ' + Object.keys(WHERE).map(key => `${key} = ?`).join(' AND ');
                values = Object.values(WHERE);
            }

            const query = `DELETE FROM ${TABLE} ${whereClause}`;

            db.run(query, values, function(err) {
                if (err) {
                    db.close();
                    reject(`데이터 삭제 오류: ${err.message}`);
                } else {
                    console.log(`${this.changes}개의 행이 삭제되었습니다.`);
                    db.close((err) => {
                        if (err) console.error(`데이터베이스 종료 오류: ${err.message}`);
                        resolve(this.changes);
                    });
                }
            });
        });
    }
};