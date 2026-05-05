import { exec } from 'child_process'
import { promisify } from 'util'

export const execAsync = promisify(exec)

export const DEV_BRANCH_NAME = 'dev'

export async function verifyIfGitIsClean() {
  const { stdout } = await execAsync('git status --porcelain')

  if (stdout) {
    console.error('Git is not clean. It may cause issues with the release process.')
    process.exit(1)
  }
}

export async function verifyIfBranchIsDev() {
  const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD')
  const branchName = stdout.trim()

  if (branchName !== DEV_BRANCH_NAME) {
    console.error(`You must be on the ${DEV_BRANCH_NAME} branch to create a release.`)
    process.exit(1)
  }
}

export async function verifyBranchExists(branchName: string) {
  const result = await execAsync(`git branch --list ${branchName}`, { encoding: 'utf-8' })
  return result.stdout.trim().length > 0
}

export async function runCommand(command: string) {
  const { stdout } = await execAsync(command)
  return stdout
}

export async function getProductionVersion() {
  const { stdout } = await execAsync('git show main:package.json')

  if (!stdout) {
    console.error('Failed to get the production version from the main branch.')
    process.exit(1)
  }

  const mainPackageJson = JSON.parse(stdout)
  return mainPackageJson.version
}
