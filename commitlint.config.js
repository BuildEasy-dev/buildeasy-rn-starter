module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce the commit types defined in CLAUDE.md
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']],
    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],
    // Subject must not be sentence-case, start-case, pascal-case, upper-case
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    // Subject cannot be empty
    'subject-empty': [2, 'never'],
    // Subject must not end with a period
    'subject-full-stop': [2, 'never', '.'],
  },
};
