const yaml = require('js-yaml');
const fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });
const sql = require('mssql');

(async ()=> {
    try {
        if (!fs.existsSync('db.yml')) {
            console.error('You need to create a db config file with "db.yml" name.');
            return;
        }
        let query = '';
        while (true) {
            query = prompt("Query to run: ")?.toString();
            if (query) {
                break;
            }
        }
        if (query.toLowerCase().includes('update') || query.toLowerCase().includes('delete') || query.toLowerCase().includes('insert')) {
            console.error("Cannot send insert, update or delete command.");
            return;
        }
        const dbConfig = yaml.load(fs.readFileSync('db.yml', 'utf8'));
    
        let finalResult = [];
        await Promise.all(dbConfig.databases.map(async database => {
            try {
                await sql.connect(database.connection_string);
                const result = await sql.query(query);
                finalResult.push({
                    database_name: database.name,
                    record_set: result.recordset
                });
            } catch (err) {
                console.log(err);
            }
        }));        

        finalResult.forEach(item => {
            console.log(item.database_name);
            console.table(item.record_set);
        });
        process.exit();
    } catch (e) {
        console.log(e);
    }
})();