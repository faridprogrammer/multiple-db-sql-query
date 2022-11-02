#!/usr/bin/env node
import { terminal } from 'terminal-kit'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { prepareEnvironment, runQuery } from './lib';
import yaml from "js-yaml"

terminal.reset();

function terminate() {
    terminal.grabInput(false);
    setTimeout(function () { process.exit() }, 100);
}

terminal.on('key', function (name, matches, data) {
    if (name === 'CTRL_C') { terminate(); }
});
terminal(`\n\n`);
terminal.underline("Welcome to multiple database sql query tool!\n");

var menuItems = [
    '1. See databases',
    '2. Run query',
    '3. Exit'
];

let configPath = path.join(os.homedir(), `db.yml`);
let hasConfigFile = true;
if (!fs.existsSync(configPath)) {
    hasConfigFile = false;
    terminal.red(`You need to create a db config file with "db.yml" name in ${os.homedir()}\n`);
    terminal.white(`Do you want to create one? (y/n) `);
    terminal.yesOrNo({ yes: ['y', 'ENTER'], no: ['n'] },
        (error, result) => {
            if (result) {
                if (prepareEnvironment()) {
                    terminal.green(`\nCreated db.yml file on ${configPath}`);
                    terminal.green(`\nUpdate the db.yml file with your desired connection strings & try again...`);
                    terminal.processExit(0);
                }
            }
            else {
                terminal.yellow(`\nOk then. Bye! :)`);
            }
        }
    );
}
else {
    showMenu();
}

function showMenu() {
    terminal.bold(`\nMenu\n`);
    terminal.singleColumnMenu(menuItems, function (error, response) {
        if (response.selectedIndex == 0) {
            showDatabases();
        }
        else if (response.selectedIndex == 1) {
            getAndExecuteQuery();
        }
        else if (response.selectedIndex == 2) {
            terminal.processExit(0);
        }
        else {
            throw new Error("Select right menu item...");
        }
    });
}

function showDatabases() {
    terminal.underline(`\nList of databases\n`);
    const dbConfig = yaml.load(fs.readFileSync(path.join(os.homedir(), `db.yml`), 'utf8'));
    let index = 1;
    for (const database of dbConfig.databases) {
        terminal(index + `. ` + database.name + `\n`);
        index++;
    }
    showMenu();
}

function getAndExecuteQuery() {
    terminal.white(`\nEnter your query: `);
    terminal.inputField(
        async (error, input) => {
            let query = input;
            try {
                terminal(`\n\n`);
                let result = await runQuery(query);
                result.forEach(item => {
                    terminal(`\n`);
                    terminal.bgBlue(item.DatabaseName);
                    terminal(`\n`);
                    if (item.Error) {
                        terminal.red(item.Error + `\n`);
                    }
                    else {
                        let resultTable = item.ResultTable.toTable();

                        if (resultTable.rows.length == 0) {
                            terminal.green(`\nNo results\n`);
                            return;
                        }

                        let tableRows = [resultTable.columns.map(dd => dd.name)];

                        resultTable.rows.forEach(row => {
                            let rowArray = [];
                            for (const value of row.values()) {
                                rowArray.push(value);
                            }
                            tableRows.push(rowArray);
                        });

                        terminal.table(tableRows, { wordWrap: true, expandToWidth: true })
                        terminal(`\n`);
                    }
                });
                showMenu();
            }
            catch (err) {
                terminal.red(`\n ${err.message}`);
            }
        }
    );
}