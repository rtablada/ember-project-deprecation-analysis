export const CONFIG = {
  'lint-to-the-future-ember-template': {
    lintRules: [
      'builtin-component-arguments',
      'link-href-attributes',
      'no-action',
      'no-array-prototype-extensions',
      'no-curly-component-invocation',
      'no-valueless-arguments',
      'no-implicit-this',
      'no-link-to-positional-params',
      'no-link-to-tagname',
      'no-nested-splattributes',
      'no-obscure-array-access',
      'no-passed-in-event-handlers',
      'no-unknown-arguments-for-builtin-components',
      'require-valid-alt-text',
    ],
  },
  'lint-to-the-future-eslint': {
    lintRules: [
      'ember/no-implicit-injections',
      'ember/no-deprecated-router-transition-methods',
      'ember/require-computed-property-dependencies',
      'ember/no-classic-classes',
      'ember/no-controller-access-in-routes',
    ],
  },
};

export const PODS_DIR = process.env.PODS_DIR;

export const PROJECT_PATH = process.env.PROJECT_PATH ?? process.cwd();
