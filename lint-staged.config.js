const micromatch = require('micromatch')

module.exports = {
  '*': files => {
    const commands = []

    const tsFiles = micromatch(files, ['**/*.ts?(x)'])
    if (tsFiles.length > 0) {
      commands.push('npm run typecheck')
    }

    const localeJsonFiles = micromatch(files, ['**/src/locales/**/*.json'])
    if (localeJsonFiles.length > 0) {
      commands.push('npm run translate')
      commands.push('npm run lint -- src/locales/**/*.json')
      commands.push('git add src/locales/**/*.json')
    }

    const filesToLint = micromatch(files, ['**/*.ts?(x)'])
    if (filesToLint.length > 0) {
      commands.push(`npm run lint -- ${filesToLint.join(' ')}`)
    }

    return commands
  },
}
