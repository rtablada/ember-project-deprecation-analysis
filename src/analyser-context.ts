import { DirectoryTree } from 'directory-tree';
import path from 'path';
import { ComponentResults } from './getComponentInfo';
import { LintResults } from './types';
import _ from 'lodash';
import {
  PodResult,
  PodAnalyserFileResult,
  ApplicationResult,
  ComponentResult,
  ComponentsUsedResult,
} from './result-analysers/result';
import { JavascriptClassCalculator } from './result-analysers/class-calculator';
import { TemplateCalculator } from './result-analysers/template-calculator';
import { ApplicationResultCalculator } from './result-analysers/application-calculator';
import { PodResultCalculator } from './result-analysers/pod-calculator';
import ComponentDataManager from './component-data-manager';
import { CONFIG } from './config';

const templateLintDeprecations = CONFIG['lint-to-the-future-ember-template'].lintRules,
  esLintDeprecations = CONFIG['lint-to-the-future-eslint'].lintRules;

const isValidTemplateDeprecation = (lintRule) => templateLintDeprecations.includes(lintRule);
const isValidEslintDeprecation = (lintRule) => esLintDeprecations.includes(lintRule);

export class AnalyserContext {
  componentResultsRecord: Record<string, ComponentResult>;
  applicationCalculator: ApplicationResultCalculator;
  componentDataManager: ComponentDataManager;

  getLintIgnoresForTemplate(path: string): string[] {
    const appPath = this.getRelativePath(path);

    return Object.keys(this.templateLintResults).filter((lintRule) =>
      this.templateLintResults[lintRule].includes(appPath)
    );
  }

  getDeprecationsForTemplate(path: string): string[] {
    return this.getLintIgnoresForTemplate(path).filter(isValidTemplateDeprecation);
  }

  getLintIgnoresForJavascript(path: string): string[] {
    return Object.keys(this.eslintResults).filter((lintRule) => this.eslintResults[lintRule].includes(path));
  }

  getDeprecationsForJavascript(path: string): string[] {
    return this.getLintIgnoresForJavascript(path).filter(isValidEslintDeprecation);
  }

  getComponentsUsed(path: string): string[] {
    const relativePath = this.getRelativePath(path);

    return this.componentDataManager.getComponentsUsedForPath(relativePath);
  }

  eslintResults: LintResults;
  templateLintResults: LintResults;
  podFileTree: DirectoryTree;
  basePath: string;

  constructor(
    basePath: string,
    components: ComponentResults,
    eslintResults: LintResults,
    templateLintResults: LintResults,
    podFileTree: DirectoryTree
  ) {
    this.basePath = basePath;
    this.eslintResults = eslintResults;
    this.templateLintResults = templateLintResults;
    this.podFileTree = podFileTree;
    this.componentDataManager = new ComponentDataManager(this, components);
  }

  analyseApplication(podFileTree: DirectoryTree): ApplicationResult {
    this.componentDataManager.analyseComponentData();

    this.applicationCalculator = new ApplicationResultCalculator(this, podFileTree);
    this.applicationCalculator.analyseComponents();

    return this.applicationCalculator.getResult();
  }

  getOutput(podFileTree: DirectoryTree): PodResult | PodAnalyserFileResult {
    // We're in a directory... Keep Going Down
    if (podFileTree.children) {
      return new PodResultCalculator(this, podFileTree).getResult();
    }

    return this.analyseFile(podFileTree);
  }

  analyseFile(podFileTree: DirectoryTree): PodAnalyserFileResult {
    let calculator;

    switch (podFileTree.name) {
      case 'template.hbs':
        calculator = new TemplateCalculator(this, podFileTree);
        break;
      case 'component.js':
        calculator = new JavascriptClassCalculator(this, podFileTree, 'component');
        break;
      case 'controller.js':
        calculator = new JavascriptClassCalculator(this, podFileTree, 'controller');
        break;
      case 'route.js':
        calculator = new JavascriptClassCalculator(this, podFileTree, 'route');
        break;
      case 'service.js':
        calculator = new JavascriptClassCalculator(this, podFileTree, 'service');
        break;
      default:
        return;
    }

    return calculator.getResult();
  }

  getRelativePath(filePath: string): string {
    return path.relative(this.basePath, filePath);
  }

  getDirectoryPath(filePath: string): string {
    return this.getRelativePath(path.dirname(filePath));
  }
  getComponentPaths(): string[] {
    return this.componentDataManager.getComponentPaths();
  }

  getComponentNameForPath(path: string): string {
    return this.componentDataManager.getComponentNameForPath(path);
  }

  setComponentResults(componentsResult: import('./result-analysers/result').ComponentResult[]) {
    this.componentResultsRecord = componentsResult.reduce((accum, result) => {
      return {
        ...accum,
        [result.componentName]: result,
      };
    }, {});
  }

  computeComponentAnalyserResults(componentsUsed: string[]): ComponentsUsedResult {
    if (!this.componentResultsRecord) return;

    const componentResults = componentsUsed.map((componentName) => this.componentResultsRecord[componentName]);
    if (!componentResults) return;

    return {
      componentAnalyserResults: componentResults,
      componentsDeprecationsCount: _.reduce(componentResults, (acc, c: ComponentResult) => c.deprecationsCount, 0),
      componentsDeprecationsFound: _.chain(componentResults)
        .map((a) => a.deprecationsFound)
        .flatten()
        .uniq()
        .value(),
    };
  }
}
