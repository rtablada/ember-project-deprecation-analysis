import { list as listEslint } from 'lint-to-the-future-eslint';
import { list as listTemplateLint } from 'lint-to-the-future-ember-template';
import directoryTree from 'directory-tree';
import path from 'path';
import { PROJECT_PATH, PODS_DIR } from './config';
import { getComponentInfo } from './getComponentInfo';
import { LintResults } from './types';
import { AnalyserContext } from './analyser-context';
import { writeFile } from 'fs/promises';

async function main() {
  // Get Folder Tree
  const rootPodsPath = PODS_DIR ? path.join(PROJECT_PATH, PODS_DIR) : path.join(PROJECT_PATH, 'app');

  const podFileTree = directoryTree(rootPodsPath, { extensions: /\.(js|hbs)$/ });

  // Get Component Info
  console.log('Getting Component Info...');
  const components = getComponentInfo(PROJECT_PATH);
  console.log('Getting ESLint Results...');
  const eslintResults: LintResults = await listEslint(PROJECT_PATH);
  console.log('Getting Template Lint Results...');
  const templateLintResults: LintResults = await listTemplateLint(PROJECT_PATH);

  console.log('Analysing Project...');
  const podAnalyser = new AnalyserContext(
    path.join(PROJECT_PATH),
    components,
    eslintResults,
    templateLintResults,
    podFileTree
  );

  const output = podAnalyser.analyseApplication(podFileTree);
  await writeFile('out.log', JSON.stringify(output, null, 2));
  console.log('Analysis written to ./out.log');
}

main();
