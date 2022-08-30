import yaml from "js-yaml"
import fs from "fs"
import sql from "mssql"
import { QueryResult } from "./queryResult";
import path from "path"
import os from "os"
export const runQuery = async (query: string): Promise<QueryResult[]> => {
    if (query.toLowerCase().includes('update') || query.toLowerCase().includes('delete') || query.toLowerCase().includes('insert')) {
        console.error("Cannot send insert, update or delete command.");
        return;
    }

    const dbConfig = yaml.load(fs.readFileSync(path.join(os.homedir(), `db.yml`), 'utf8'));
    let queryResults: QueryResult[] = [];
    for (let database of dbConfig.databases) {
        try {
            let pool = await sql.connect(database.connection_string);
            try {
                const result = await sql.query(query);
                queryResults.push({
                    DatabaseName: database.name,
                    ResultTable: result.recordset,
                })
            }
            finally {
                pool.close();
            }
        } catch (err) {
            queryResults.push({
                DatabaseName: database.name,
                Error: err.toString()
            });
        }
    }
    return queryResults;
}

export function prepareEnvironment(): boolean {
    let filePath = path.join(os.homedir(), `db.yml`);
    if (fs.existsSync(filePath)) {
        console.error(`There is already a "db.yml" file in ${os.homedir()}`);
        return false;
    }
    else {
        fs.writeFileSync(filePath, `databases:
        -
            name: Db2
            connection_string: server=.; database=Test2; user id=sa; password=1; multipleactiveresultsets=true; asynchronous processing=true;TrustServerCertificate=True;    
        -
            name: Db3
            connection_string: server=.; database=Test3; user id=sa; password=1; multipleactiveresultsets=true; asynchronous processing=true;TrustServerCertificate=True;`);
        return true;
    }

}
