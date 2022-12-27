import { DirectoryTree } from 'directory-tree';
import _ from 'lodash';
import { AnalyserContext } from 'src/analyser-context';
import { PodFileType } from 'src/types';
import { BaseResultCalculator } from './base-result-calculator';
import { PodResult, PodAnalyserFileResult, DirectoryResult } from './result';

export class DirectoryResultCalculator extends BaseResultCalculator {
  childrenResults: (PodResult | PodAnalyserFileResult)[];

  constructor(context: AnalyserContext, podFileTree: DirectoryTree) {
    super(context, podFileTree);
  }

  protected get childTrees() {
    return this.podFileTree.children;
  }

  protected getChildrenResults(): (PodResult | PodAnalyserFileResult)[] {
    return this.childTrees.map((t) => this.context.getOutput(t)).filter((a) => a);
  }

  getResult(): DirectoryResult {
    const childrenResults = this.getChildrenResults();

    return {
      ...this.getBaseResult(),
      children: childrenResults,
      componentsUsed: _.chain(childrenResults)
        .map((a) => a.componentsUsed)
        .flatten()
        .uniq()
        .value(),
      fileCount: _.sumBy(childrenResults, (a: PodResult) => a.fileCount || 1),
      deprecationsFound: _.chain(childrenResults)
        .map((a) => a.deprecationsFound)
        .flatten()
        .uniq()
        .value(),
      deprecationsCount: _.sumBy(childrenResults, (a) => a.deprecationsCount),
    } as DirectoryResult;
  }

  getPathOfChild(fileType: PodFileType, childrenResults: (PodResult | PodAnalyserFileResult)[]): string {
    const x = childrenResults.find((a: PodAnalyserFileResult) => a.podFileType === fileType);

    return x?.path;
  }
}
