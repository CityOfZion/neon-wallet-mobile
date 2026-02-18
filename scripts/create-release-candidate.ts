import { format } from 'date-fns'
import fs from 'fs/promises'
import inquirer from 'inquirer'
import lodash from 'lodash'
import path from 'path'

import packageJson from '../package.json'
import { DEV_BRANCH_NAME, getProductionVersion, runCommand, verifyIfBranchIsDev, verifyIfGitIsClean } from './utils'

async function bumpVersion() {
  const { value: selectedBumpType } = await inquirer.prompt([
    {
      type: 'select',
      message: 'Select the bump type',
      name: 'value',
      loop: false,
      default: 'patch',
      choices: [
        { value: 'patch', name: 'Patch' },
        { value: 'minor', name: 'Minor' },
        { value: 'major', name: 'Major' },
      ],
    },
  ])

  const stdout = await runCommand(`npm version ${selectedBumpType} --no-git-tag-version --no-commit-hooks --json`)

  const bumpedVersion = stdout.slice(1, -1)

  // Directly commit the changes to the dev branch because it is important to keep the dev branch updated
  await runCommand('git add .')
  await runCommand(`git commit -m "Bump version to ${bumpedVersion}" --no-verify`)
  await runCommand(`git push origin ${DEV_BRANCH_NAME} --no-verify`)

  return bumpedVersion
}

function generateReleaseCandidateBranchName(version: string, isOta: boolean) {
  let branchName = `${version}-rc`
  if (isOta) {
    console.log('Renaming the branch to include "ota" suffix…')
    branchName = `${version}-rc-ota`
  }

  return branchName
}

export async function createOrUpdateChangelog(bumpedVersion: string) {
  const { default: changelog } = await import('../src/locales/en/changelog.json')

  const lastChangelogIndex = changelog.notes.findIndex(item => item.version === bumpedVersion)
  const lastChangelog = changelog.notes[lastChangelogIndex]

  if (lastChangelogIndex >= 0) {
    changelog.notes.splice(lastChangelogIndex, 1)
  }

  const { value } = await inquirer.prompt([
    {
      type: 'editor',
      message: 'Enter the release notes',
      name: 'value',
      default: JSON.stringify(
        lastChangelog ?? {
          version: bumpedVersion,
          date: format(new Date(), 'yyyy-MM-dd'),
          changes: [],
        },
        null,
        2
      ),
      postfix: '.json',
    },
  ])

  const updatedChangelog = JSON.parse(value)

  changelog.notes.unshift(updatedChangelog)

  await fs.writeFile(
    path.join(__dirname, '../src/locales/en/changelog.json'),
    JSON.stringify(changelog, null, 2),
    'utf-8'
  )

  try {
    console.log('Translating changelog to other locales…')
    await runCommand('npm run translate')
    await runCommand(`npx eslint src/locales/**/*.json --fix`)
  } catch {
    const { value: didTranslate } = await inquirer.prompt([
      {
        type: 'confirm',
        message:
          'It was not possible to translate the changelog automatically. Please translate it manually and confirm once done. Did you translate it already?',
        name: 'value',
      },
    ])

    if (!didTranslate) {
      throw new Error('Changelog translation is required to proceed.')
    }
  }

  if (!lodash.isEqual(lastChangelog, updatedChangelog)) {
    // Directly commit the changes to the dev branch because it is important to keep the dev branch updated
    await runCommand('git add .')
    await runCommand(`git commit -m "Update changelog for version ${bumpedVersion}" --no-verify`)
    await runCommand(`git push origin ${DEV_BRANCH_NAME} --no-verify`)
  }
}

async function exit(version?: string, removeReleaseCandidateBranch?: boolean) {
  await runCommand('rm -fr ".git/rebase-merge"').catch(() => {})
  await runCommand(`git checkout ${DEV_BRANCH_NAME}`).catch(() => {})

  if (version) {
    await runCommand(`git branch -D release-temp`).catch(() => {})

    if (removeReleaseCandidateBranch) {
      await runCommand(`git branch -D ${version}-rc`).catch(() => {})
    }
  }

  process.exit(1)
}

async function main() {
  let version: string | undefined

  try {
    await verifyIfGitIsClean()
    await verifyIfBranchIsDev()

    // Fetch the dev branch latest changes
    await runCommand('git pull')

    console.log('Installing dependencies…')
    await runCommand('npm install')

    // Fetch the latest master branch
    await runCommand('git fetch origin master:master')

    const { value: isOta } = await inquirer.prompt([
      {
        type: 'confirm',
        message: 'Will you distribute the app via OTA?',
        name: 'value',
      },
    ])

    const productionVersion = await getProductionVersion()
    const currentVersion = packageJson.version
    const isFirstReleaseCandidate = productionVersion === currentVersion

    // It means this is the first release candidate and we need to bump the version
    if (isFirstReleaseCandidate) {
      version = await bumpVersion()
    } else {
      version = currentVersion
    }

    await createOrUpdateChangelog(version)

    const branchName = generateReleaseCandidateBranchName(version, isOta)

    // Create a new branch for the release candidate
    await runCommand(`git branch ${branchName}`).catch(() => {})

    // Create a temp branch for the release candidate. This branch is important when we are not running this script for the fist time so we need to update the current release candidate branch
    await runCommand(`git checkout -b release-temp`)

    // Rebase the new branch on top of the latest master
    console.log('Rebasing the release candidate branch on top of the latest master…')

    await runCommand('git rebase -i master').catch(async () => {
      await inquirer.prompt([
        {
          type: 'confirm',
          message: `Looks like there are merge conflicts. Resolve then in another terminal and press enter to continue`,
        },
      ])
    })

    await runCommand(`git checkout ${branchName}`)

    // Overwrite the release candidate branch with the new changes
    await runCommand('git reset --hard release-temp')

    // Push the release candidate branch to the remote with the new changes
    await runCommand(`git push origin ${branchName} --force --no-verify`)

    const { value: shouldGenerateBuild } = await inquirer.prompt([
      {
        type: 'confirm',
        message: 'Do you want to generate the builds?',
        name: 'value',
      },
    ])

    if (shouldGenerateBuild) {
      console.log('Installing dependencies on the release candidate branch…')
      await runCommand('npm install')

      if (isOta) {
        console.log('Sending OTA…')
        await runCommand(
          `npx eas update --non-interactive --platform all --channel preview --message "Release Candidate ${version}"`
        )
      } else {
        // Generate the builds on Expo EAS
        console.log('Generating builds…')
        await runCommand('npx eas build --non-interactive --no-wait --platform all --profile preview')
      }
    }

    console.log('Everything is ready! Cleaning up…')
    await exit(version, false)
  } catch (error) {
    console.error('\nAn error occurred:\n')
    console.error(error)
    await exit(version, true)
  }
}

process.on('SIGINT', async () => {})

main()
