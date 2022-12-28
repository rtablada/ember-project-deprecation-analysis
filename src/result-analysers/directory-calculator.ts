import { DirectoryTree } from 'directory-tree';
import _ from 'lodash';
import { AnalyserContext } from 'src/analyser-context';
import { PodFileType } from 'src/types';
import { BaseResultCalculator } from './base-result-calculator';
import { PodResult, PodAnalyserFileResult, DirectoryResult, DeprecationAnalyserResult } from './result';

// const flattenUniqueBy = (arr: DeprecationAnalyserResult[], call)

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
      componentsUsed: flattenUniqBy(childrenResults, (a) => a.componentsUsed),
      fileCount: _.sumBy(childrenResults, (a: PodResult) => a.fileCount || 1),
      deprecationsFound: flattenUniqBy(childrenResults, (a) => a.deprecationsFound),
      deprecationsCount: _.sumBy(childrenResults, (a) => a.deprecationsCount),
      lintErrorsFound: flattenUniqBy(childrenResults, (a) => a.lintErrorsFound),
      lintErrorsCount: _.sumBy(childrenResults, (a) => a.lintErrorsCount),
    } as DirectoryResult;
  }

  getPathOfChild(fileType: PodFileType, childrenResults: (PodResult | PodAnalyserFileResult)[]): string {
    const x = childrenResults.find((a: PodAnalyserFileResult) => a.podFileType === fileType);

    return x?.path;
  }
}

function flattenUniqBy<T>(arr: DeprecationAnalyserResult[], callback: (a: DeprecationAnalyserResult) => T[]): T[] {
  return _.chain(arr).map(callback).flatten().uniq().value() as T[];
}
