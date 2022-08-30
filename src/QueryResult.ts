import sql, { IRecordSet, Table } from "mssql"

export class QueryResult {
    public DatabaseName: string;
    public Error? : string;
    public ResultTable?: IRecordSet<any>;
}