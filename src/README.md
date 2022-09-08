# Sql server multi db query
With the use of this package you will be able to run a single query on multiple Sql Server databases.

In order to do that. You need to define a `db.yml` file with the following structure, in your home directory.

    databases:
    -
        name: Db2
        connection_string: YOUR_CONNECTION_STRING
    -
        name: Db3
        connection_string: YOUR_CONNECTION_STRING
    
Note that you need to add `TrustServerCertificate=True` to your connection string.

# How to run
Command structure of the package is as follows:

    Commands:
    index.js run [query]  run the query

    Options:
    --help     Show help                                                 [boolean]
    --version  Show version number                                       [boolean]
    --verbose                                           [boolean] [default: false]

# Example
For example you can run your desired query like this: 

`npx sql-multi-db-query run --query 'select count(*) as [count] from core.users'`