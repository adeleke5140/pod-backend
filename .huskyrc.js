const tasks = (arr) => arr.join(' && ');

module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': tasks([
      'counter=`git diff --cached --numstat | wc -l` && if [ $counter -eq 0 ]; then exit; fi',
      'pretty-quick --staged --pattern "**/*.{json,md,yaml,yml}"',
      'lint-staged',
      'ts-node .scripts/lint-file-or-directory-name.ts',
      'ts-node .scripts/lint-queue-message.ts',
      'yarn run test',
    ]),
    'post-commit': 'git update-index --again',
  },
};
