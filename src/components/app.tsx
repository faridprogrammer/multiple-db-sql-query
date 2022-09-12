import React, { useState, useEffect } from 'react'
import { QueryResult } from '../QueryResult'
import { Text, Box } from 'ink'
import * as lib from '../lib'
import Table from 'ink-table'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { AlertType } from './AlertType'
import { Alert } from './Alert'
import TextInput from 'ink-text-input'

export const App = () => {
  let [queryResults, setQueryResults] = useState<QueryResult[]>([])
  let [error, setError] = useState<boolean>(false)
  let [query, setQuery] = useState<string>('')
  let [alert, setAlert] = useState<Alert[]>([])

  const handleSubmit = (query) => {
    setAlert((prev) => [
      ...prev,
      new Alert(`Running queries...`, AlertType.Info),
    ])
    lib.runQuery(query).then((res) => {
      setAlert((prev) => [
        ...prev,
        new Alert(`Query execution ended...`, AlertType.Success),
      ])
      setQueryResults(res)
    })
    // if (lib.prepareEnvironment()) {
    //   setAlert((prev) => [
    //     ...prev,
    //     new Alert(`db.yml file created...`, AlertType.Success),
    //   ])
    // }
  }
  useEffect(() => {
    if (!fs.existsSync(path.join(os.homedir(), `db.yml`))) {
      setAlert((prev) => [
        ...prev,
        new Alert(
          `You need to create a db config file with "db.yml" name in ${os.homedir()}\nUse "prep" command to create the file.`,
          AlertType.Error,
        ),
      ])
      setError(true)
    }
  }, [])

  return (
    <Box flexDirection="column">
      <Box key="static_alerts" flexDirection="column">
        {alert.map(
          (alertItem) =>
            alertItem && (
              <Text key={alertItem.Message} color={alertItem.getColor()}>
                {alertItem.Message}{' '}
              </Text>
            ),
        )}
      </Box>
      <Box display={error ? 'none' : 'flex'}>
        <Box marginRight={1}>
          <Text>Enter your query:</Text>
        </Box>
        <TextInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
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
                  paddingLeft={2}
                >
                  <Box alignItems="center" width="100%">
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
                  paddingLeft={2}
                >
                  <Box alignItems="center" width="100%">
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
