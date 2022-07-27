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
- On each line, replace `pick` by `drop`. And then, find the commits you want to add to this version and replace `drop` by `p`. Do this for the release candidate commit as well. Save and close the file.
- If there is a conflict, resolve them, then `git add .` and `git rebase --continue`
- **git checkout master**
- **git merge release-** `version`
- **git push origin**
- For each of these issues on Clickup, change the Code Location to "Production"

## Staging
- List the issues that will be deployed
- git checkout staging
- git pull
- cat package.json | grep version
    - Write down this version
    - The new version will be the current version with "minor" increased, example:
      - `1.1.3` -> `1.2.0`
- git checkout development
- git pull
- Change the version on package.json with the new version
- git add .
- git commit -m "release candidate `new version`"
- git checkout -b rc-`new version`
- git rebase -i staging
- On each line, replace `pick` by `drop`. And then, find the commits you want to add to this version and replace `drop` by `p`. Do this for the release candidate commit as well. Save and close the file.
- If there is a conflict, resolve them, then `git add .` and `git rebase --continue`
- git checkout staging
- git merge rc-`new version`
- git push origin
- For each of these issues on Clickup, change the Code Location to "Staging"
