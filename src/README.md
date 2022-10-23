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

# Help
Run the tool and follow the steps. Menu provided in the tool is perfectly straightforward.
# Installation
For example you can run your desired query like this: 

`npm install sql-multi-db-query -g`

# Usage

`sql-multi-db-query`
