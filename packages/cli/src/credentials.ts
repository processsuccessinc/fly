import { FlyCommand } from "./base-command"
import * as path from "path"
import * as fs from "fs"
import YAML = require("js-yaml")

export function getToken(cmd: FlyCommand) {
  const token = null // recursivelyGetOption(cmd, "token") || process.env.FLY_ACCESS_TOKEN
  if (!token) {
    try {
      const creds = getCredentials()
      if (creds) {
        return creds.access_token
      }
    } catch (e) {
      // do nothing
    }
  }

  if (!token) {
    throw new Error("--token option or environment variable FLY_ACCESS_TOKEN needs to be set.")
  }
  return token
}

export function homeConfigPath() {
  const home = getUserHome()
  if (!home) {
    throw new Error("Where is your HOME? Please set the HOME environment variable and try again.")
  }
  const homepath = path.join(home, ".fly")
  fs.mkdirSync(homepath, { recursive: true })
  return homepath
}

export function credentialsPath() {
  const homepath = homeConfigPath()
  const credspath = path.join(homepath, "credentials.yml")
  return credspath
}

export function storeCredentials(data: any) {
  fs.writeFileSync(credentialsPath(), YAML.dump(data))
}

function getUserHome() {
  return process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"]
}

function getCredentials() {
  const credspath = path.join(homeConfigPath(), "credentials.yml")
  if (!fs.existsSync(credspath)) {
    return
  }
  return YAML.load(fs.readFileSync(credspath).toString())
}
