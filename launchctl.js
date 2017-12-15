import fs from 'fs'
import expandPath from 'expand-tilde'
import {parse} from 'fast-plist'
import {exec, execSync} from 'child_process'

class LaunchCtl {
    /**
     * Simple launchctl wrapper.
     * @constructor
     * @param {string} path - Path to Launch Agent. Can contain tilde.
     */
    constructor(path) {
        this.path = expandPath(path);
    }

    /**
     * Initiates class object to use with specified agent (asynchronous).
     * @return {Promise}
     */
    init() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf8', (err, plist) => {
                if (err) {
                    return reject(err)
                }
                let parsedPlist = parse(plist);
                if (!parsedPlist) {
                    reject(new Error('Can not parse property list'))
                }
                if (!parsedPlist.hasOwnProperty('Label')) {
                    reject(Error('Property list has no label'))
                }
                this.name = parsedPlist.Label;
                resolve()
            })
        })
    }

    /**
     * Initiates class object to use with specified agent (synchronous).
     */
    initSync() {
        if (!fs.existsSync(this.path)) {
            throw new Error(`${this.path} does not exists`);
        }
        let plist = fs.readFileSync(this.path, 'utf8');
        let parsedPlist = parse(plist);
        if (!parsedPlist) {
            throw new Error('Can not parse property list')
        }
        if (!parsedPlist.hasOwnProperty('Label')) {
            throw new Error('Property list has no label')
        }
        this.name = parsedPlist.Label
    }

    /**
     * Checks if service currently running (asynchronous).
     * @return {Promise}
     */
    running() {
        return new Promise((resolve, reject) => {
            exec('launchctl list', (err, result) => {
                if (err) {
                    return reject(err)
                }
                resolve(result.includes(this.name))
            })
        })
    }

    /**
     * Checks if service currently running (synchronous).
     */
    runningSync() {
        let result = execSync('launchctl list');
        return result.includes(this.name)
    }

    /**
     * Unloads service (asynchronous).
     * @return {Promise}
     */
    unload() {
        return new Promise((resolve, reject) => {
            exec(`launchctl unload ${this.path}`, (err, data) => {
                if (err) {
                    return reject(err)
                }
                resolve()
            })
        })
    }

    /**
     * Unloads service (synchronous).
     */
    unloadSync() {
        execSync(`launchctl unload ${this.path}`)
    }

    /**
     * Loads service (asynchronous).
     * @return {Promise}
     */
    load() {
        return new Promise((resolve, reject) => {
            exec(`launchctl load ${this.path}`, (err, data) => {
                if (err) {
                    return reject(err)
                }
                resolve()
            })
        })
    }

    /**
     * Loads service (synchronous).
     */
    loadSync() {
        execSync(`launchctl load ${this.path}`)
    }

}

export {LaunchCtl as default}