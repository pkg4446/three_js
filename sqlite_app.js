const db = require("./sqlite_core");

const path = "./test.db";
const table = "users";

const data = {
    key : "test",
    id  : 1
}

console.log(Object.keys(data).length);
console.log(Object.entries(data));
console.log(Object.keys(data));

async function create() {
    try {
        // 테이블 생성
        await db.create(path, table,{
            name: ['TEXT', 'NOT NULL'],
            email: ['TEXT', 'UNIQUE', 'NOT NULL']
        });
    } catch (error) {
        console.error('오류 발생:', error);
    }
}

async function write() {
    try {
        // 데이터 쓰기
        const newId = await db.write(path, table, {
            name: 'John Doe2',
            email: 'joh42n@example.com'
        });
        console.log(`새 사용자 ID: ${newId}`);
    } catch (error) {
        console.error('오류 발생:', error);
    }
}
//write();

async function read() {
    try {
        // 데이터 읽기
        const rows = await db.read(path, 'SELECT * FROM users');
        console.log('사용자 목록:', rows);
    } catch (error) {
        console.error('오류 발생:', error);
    }
}
// SELECT idx,email FROM user ORDER BY idx DESC;
// ORDER BY idx ASC
// ORDER BY idx DESC
// LIMIT 1
read();

async function updateExample() {
    try {
        const updatedRows = await db.update(
            path,
            table,
            { name: 'Jane Doe1', email: 'jane@example.com' },
            { idx: 1 }
        );
        console.log(`업데이트된 행 수: ${updatedRows}`);
    } catch (error) {
        console.error('오류 발생:', error);
    }
}
//updateExample();

async function deleteExample() {
    try {
        // id가 5인 사용자 삭제
        const deletedRows = await db.delete('./test.db', 'users', { idx: 1 });
        console.log(`삭제된 행 수: ${deletedRows}`);

        // 모든 사용자 삭제 (주의: 위험한 작업입니다!)
        // const allDeleted = await db.delete('./test.db', 'users');
        // console.log(`삭제된 총 행 수: ${allDeleted}`);
    } catch (error) {
        console.error('오류 발생:', error);
    }
}

/*
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE lorem (info TEXT)");

    const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (let i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
        console.log(row.id + ": " + row.info);
    });
});

db.close();
*/