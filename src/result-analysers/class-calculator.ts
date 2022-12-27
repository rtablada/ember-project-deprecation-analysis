import { DirectoryTree } from 'directory-tree';
import { AnalyserContext } from 'src/analyser-context';
import { PodFileType } from 'src/types';
import { BaseResultCalculator } from './base-result-calculator';
import { PodAnalyserFileResult } from './result';

export class JavascriptClassCalculator extends BaseResultCalculator {
  podFileType: string;

  constructor(context: AnalyserContext, podFileTree: DirectoryTree, podFileType: PodFileType) {
    super(context, podFileTree);
    this.podFileType = podFileType;
  }

  getDeprecationInfo() {
    const deprecations = this.context.getDeprecationsForJavascript(this.podFileTree.path);

    return {
      deprecationsFound: deprecations,
      deprecationsCount: deprecations.length,
    };
  }

  getResult(): PodAnalyserFileResult {
    return {
      podFileType: this.podFileType,
      ...this.getBaseResult(),
      ...this.getDeprecationInfo(),
    } as PodAnalyserFileResult;
  }
}
