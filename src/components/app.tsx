import React, { useState, useEffect } from 'react'
import { QueryResult } from '../QueryResult'
import { Text, Box, Newline } from 'ink'
import * as lib from '../lib'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Table from 'ink-table'
import fs from 'fs'
import os from 'os'
import path from 'path'

enum AlertType {
  Success,
  Info,
  Error,
}
class Alert {
  constructor(public Message: string, public Type: AlertType) {}
  getColor(): string {
    switch (this.Type) {
      case AlertType.Info:
        return 'blue'
      case AlertType.Error:
        return 'red'
      case AlertType.Success:
        return 'green'
      default:
        return ''
    }
  }
}

export const App = () => {
  let [queryResults, setQueryResults] = useState<QueryResult[]>([])
  let [alert, setAlert] = useState<Alert>(null)

  useEffect(() => {
    let getData = async () => {
      {
        yargs(hideBin(process.argv))
          .command(
            'run [query]',
            'run the query',
            (yargs) => {
              return yargs.option('query', {
                describe: 'A query to run against databases in db.yml',
                demandOption: true,
                type: 'string',
              })
            },
            (argv) => {
              if (!fs.existsSync(path.join(os.homedir(), `db.yml`))) {
                setAlert(
                  new Alert(
                    `You need to create a db config file with "db.yml" name in ${os.homedir()}\nUse "prep" command to create the file.`,
                    AlertType.Error,
                  ),
                )
              } else {
                setAlert(new Alert(`Running queries...`, AlertType.Info))
                lib.runQuery(argv.query).then((res) => {
                  setAlert(
                    new Alert(`Query execution ended...`, AlertType.Success),
                  )
                  setQueryResults(res)
                })
              }
            },
          )
          .command(
            'prep',
            'Creates required files to use package. Like: db.yml in home dir',
            (yargs) => {},
            (argv) => {
              if (lib.prepareEnvironment()) {
                setAlert(new Alert(`db.yml file created...`, AlertType.Success))
              }
            },
          )
          .option({
            verbose: { type: 'boolean', default: false },
          })
          .strictCommands()
          .demandCommand(1)
          .parse()
      }
    }
    getData().catch(console.error)
  }, [])

  return (
    <Box flexDirection="column">
      <Box>
        {alert && <Text color={alert.getColor()}>{alert.Message} </Text>}
      </Box>
      {queryResults.length != 0 && (
        <Box flexDirection="column" width="100%">
          {queryResults.map((item) => {
            let resultsToRender = []
            if (item.ResultTable) {
              for (let index = 0; index < item.ResultTable.length; index++) {
                const queryResult = item.ResultTable[index]
                resultsToRender.push(queryResult)
              }
              return (
                <Box
                  key={item.DatabaseName}
                  flexDirection="column"
                  borderColor="cyanBright"
                  borderStyle="classic"
                  paddingLeft={2}
                >
                  <Box alignItems="center"  width="100%">
                    <Text bold={true} color="blue" key={item.DatabaseName}>
                      {item.DatabaseName}
                    </Text>
                  </Box>
                  <Box>
                    <Table data={resultsToRender}></Table>
                  </Box>
                </Box>
              )
            } else if (item.Error) {
              return (
                <Box
                  key={item.DatabaseName}
                  flexDirection="column"
                  borderColor="cyanBright"
                  borderStyle="classic"
                  paddingLeft={2}
                >
                  <Box alignItems='center' width="100%">
                    <Text bold={true} color="blue" key={item.DatabaseName}>
                      {item.DatabaseName}
                    </Text>
                  </Box>
                  <Box>
                    <Text color="red" key={item.DatabaseName}>
                      {item.Error}
                    </Text>
                  </Box>
                </Box>
              )
            } else {
              ;<Text>Hmmm I dont know what to do...</Text>
            }
          })}
        </Box>
      )}
    </Box>
  )
}
