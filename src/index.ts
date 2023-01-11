import { list as listEslint } from 'lint-to-the-future-eslint';
import { list as listTemplateLint } from 'lint-to-the-future-ember-template';
import directoryTree from 'directory-tree';
import path from 'path';
import { getComponentInfo } from './getComponentInfo';
import { LintResults } from './types';
import { AnalyserContext } from './analyser-context';

export async function analyseProject(projectPath: string, podDirectory: string) {
  // Get Folder Tree
  const rootPodsPath = path.join(projectPath, podDirectory);

  const podFileTree = directoryTree(rootPodsPath, { extensions: /\.(js|hbs)$/ });

  // Get Component Info
  console.log('Getting Component Info...');
  const components = getComponentInfo(projectPath);
  console.log('Getting ESLint Results...');
  const eslintResults: LintResults = await listEslint(projectPath);
  console.log('Getting Template Lint Results...');
  const templateLintResults: LintResults = await listTemplateLint(projectPath);

  console.log('Analysing Project...');
  const podAnalyser = new AnalyserContext(
    path.join(projectPath),
    components,
    eslintResults,
    templateLintResults,
    podFileTree
  );

  return podAnalyser.analyseApplication(podFileTree);
}
