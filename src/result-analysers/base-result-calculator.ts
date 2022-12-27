import { DirectoryTree } from 'directory-tree';
import { AnalyserContext } from 'src/analyser-context';
import { DeprecationAnalyserResult } from './result';

export abstract class BaseResultCalculator {
  context: AnalyserContext;
  podFileTree: DirectoryTree;

  constructor(podAnalyser: AnalyserContext, podFileTree: DirectoryTree) {
    this.context = podAnalyser;
    this.podFileTree = podFileTree;
  }

  protected getBaseResult(): DeprecationAnalyserResult {
    const componentsUsed = this.context.getComponentsUsed(this.podFileTree.path);

    const componentUseResult = this.context.computeComponentAnalyserResults(componentsUsed);

    return {
      path: this.context.getRelativePath(this.podFileTree.path),
      componentsUsed,
      ...(componentUseResult ?? {}),
    } as DeprecationAnalyserResult;
  }
}
