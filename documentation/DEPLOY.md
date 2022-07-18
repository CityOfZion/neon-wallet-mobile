# Deployment Process

## Staging
- List the issues that will be deployed
- cd C:\Workspace\neon-wallet-mobile
- git checkout staging
- git pull
- cat package.json | grep version
    - Write down this version
- git checkout development
- git pull
- git checkout -b rc-`new version: with minor imediately after the minor of the version and patch zero`
- git rebase -i staging
- On each line, replace `pick` by `drop`. And then, find the commits you want to add to this version and replace `drop` by `p`. Save and close the file.
- If there is a conflict, resolve them, then `git add .` and `git rebase --continue`
- Change the version on package.json with the branch version
- Build the project to check if it compiles
- git add .
- git commit -m "release candidate `version`"
- git checkout staging
- git merge rc-`version`
- git push origin
- For each of these issues on Clickup, change the Code Location to "Staging"
