import { DirectoryTree } from 'directory-tree';
import { flatten } from 'lodash';
import { ComponentResultCalculator } from './component-calculator';
import { PodResultCalculator } from './pod-calculator';
import { ApplicationResult, ComponentResult } from './result';

export class ApplicationResultCalculator extends PodResultCalculator {
  componentsDirectory: DirectoryTree;
  componentsResult: ComponentResult[];

  analyseComponents() {
    this.componentsDirectory = this.podFileTree.children.find((a) => a.name === 'components');
    const rawComponentNodes = this.filterDirectoryNodes();

    this.componentsResult = rawComponentNodes.map((directoryTree) =>
      new ComponentResultCalculator(this.context, directoryTree).getResult()
    );

    this.context.setComponentResults(this.componentsResult);
    this.componentsResult.forEach((c) => {
      const componentsUsedResults = this.context.computeComponentAnalyserResults(c.componentsUsed);

      c.componentsDeprecationsCount = componentsUsedResults?.componentsDeprecationsCount;
      c.componentsDeprecationsFound = componentsUsedResults?.componentsDeprecationsFound;
    });
  }

  get childTrees(): DirectoryTree[] {
    return this.podFileTree.children.filter((a) => a.name !== 'components');
  }

  getResult(): ApplicationResult {
    const baseResult = super.getResult();

    return {
      componentResults: this.componentsResult,
      ...baseResult,
    };
  }

  private filterDirectoryNodes(): DirectoryTree[] {
    const componentPaths = this.context.getComponentPaths();
    return deepDirectoryFilter(this.componentsDirectory, (a) => componentPaths.includes(a.path));
  }
}

function deepDirectoryFilter(dirTree: DirectoryTree, filter: (a: DirectoryTree) => boolean): DirectoryTree[] {
  let results: DirectoryTree[] = [];

  if (filter(dirTree)) {
    results = [...results, dirTree];
  }

  if (dirTree.children) {
    const childrenResults = flatten(dirTree.children.map((c) => deepDirectoryFilter(c, filter)));
    results = [...results, ...childrenResults];
  }

  return results;
}
