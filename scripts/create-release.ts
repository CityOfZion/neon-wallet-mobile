import packageJson from '../package.json'
import {
  DEV_BRANCH_NAME,
  getProductionVersion,
  runCommand,
  verifyBranchExists,
  verifyIfBranchIsDev,
  verifyIfGitIsClean,
} from './utils'

async function getReleaseCandidateBranchName(currentVersion: string) {
  const output = await runCommand(`git branch --list "${currentVersion}-rc*" --format="%(refname:short)"`)

  return output.trim()
}

async function exit() {
  await runCommand(`git checkout ${DEV_BRANCH_NAME}`).catch(() => {})
  process.exit(1)
}

async function main() {
  try {
    await verifyIfGitIsClean()
    await verifyIfBranchIsDev()

    //Fetch the development branch latest changes
    await runCommand('git pull')

    console.log('Installing dependencies…')
    await runCommand('npm install')

    const productionVersion = await getProductionVersion()
    const currentVersion = packageJson.version

    const releaseCandidateBranchName = await getReleaseCandidateBranchName(currentVersion)
    const isOta = releaseCandidateBranchName.includes('ota')
    const releaseCandidateBranchExists = await verifyBranchExists(releaseCandidateBranchName)

    if (productionVersion === currentVersion || !releaseCandidateBranchExists) {
      console.log(
        'You have to create a release candidate first. Please run the command `npm run create-release:candidate`'
      )
      process.exit(0)
    }

    await runCommand(`git checkout ${releaseCandidateBranchName}`)

    console.log('Installing dependencies on the release candidate branch…')
    await runCommand('npm install')

    console.log('Creating the PR…')
    await runCommand(
      `gh pr create --base main --head ${releaseCandidateBranchName} --body "" --title "Release ${currentVersion}"`
    )

    if (isOta) {
      console.log('Sending OTA…')
      await runCommand(
        `npx eas update --non-interactive --platform all --channel production --message "Release ${currentVersion}"`
      )
    } else {
      console.log('Generating builds…')
      const creatingBuildsStdout = await runCommand(
        'npx eas build --non-interactive --no-wait --json --platform all --profile production'
      )

      console.log('Updating PR with the builds link')
      const builds = JSON.parse(creatingBuildsStdout) as any[]
      const buildsString = builds.reduce((buildString, build) => {
        buildString += `${build.platform} - https://expo.dev/accounts/cityofzion.io/projects/neon/builds/${build.id}\n`
        return buildString
      }, '')
      await runCommand(`gh pr comment ${releaseCandidateBranchName} --body "Builds:\n\n${buildsString}"`)
    }

    console.log('Everything is ready! Cleaning up…')
    await exit()
  } catch (error) {
    console.error('\nAn error occurred:\n')
    console.error(error)
    await exit()
  }
}

process.on('SIGINT', async () => {})

main()
