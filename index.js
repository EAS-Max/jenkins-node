import 'dotenv/config';
import express from 'express';
import ora from 'ora';
import chalk from 'chalk';
import ip from 'ip';
import config from './config.js'
import fetch from 'node-fetch';

const spinner = ora().start();
const app = express()

console.clear()

Object.entries(config).filter(([, value]) => !value).length > 0 && (spinner.fail(chalk.red(`Missing environment configuration. Exiting early.
${Object.entries(config).map(([key, value]) => chalk.grey(`    ${key}=${value}\n`)).join('')}
`)) && process.exit(1))



app.get('/', async (req, res) => {
    try {
        const response = await fetch(config.TARGET_URL);
        const data = await response.json();
        spinner.succeed(`Processed request to ${config.TARGET_URL}`)
        res.json([
            ...data,
            `${ip.address()} ---> ${config.TARGET_URL}`
        ])
        process.exit(0)
    } catch (err) {
        spinner.fail(`Failed to make request to ${config.TARGET_URL}`)
        res.json([
            `${ip.address()} -X-> ${config.TARGET_URL}`
        ])
        process.exit(1)
    }
})

app.listen(config.PORT, () => {
    spinner.color = 'yellow';
    spinner.text = `${chalk.grey('Waiting to process requests at')} ${ip.address()}:${config.PORT}`;
})