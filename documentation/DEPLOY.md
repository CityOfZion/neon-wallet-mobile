# Deployment Process

## Master

- List the issues that will be deployed
- **git checkout master**
- **git pull**
- **git checkout staging**
- **git pull**
- cat package.json | grep version
  - Write down this version
- **git checkout -b release-** `version copied`
- **git rebase -i master**
- On each line, replace `pick` by `drop`. And then, find the commits you want to add to this version and replace `drop` by `p`. Save and close the file.
- If there is a conflict, resolve them, then `git add .` and `git rebase --continue`
- **git checkout master**
- **git merge release-** `version`
- **git push origin**
- dá close em todas aquelas issues
- For each of these issues on Clickup, change the Code Location to "Production"

## Staging
- List the issues that will be deployed
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
