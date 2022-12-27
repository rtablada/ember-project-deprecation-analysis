import { BaseResultCalculator } from './base-result-calculator';
import { PodAnalyserFileResult } from './result';

export class TemplateCalculator extends BaseResultCalculator {
  getDeprecationInfo() {
    const deprecations = this.context.getDeprecationsForTemplate(this.podFileTree.path);

    return {
      deprecationsFound: deprecations,
      deprecationsCount: deprecations.length,
    };
  }

  getResult(): PodAnalyserFileResult {
    return {
      podFileType: 'template',
      ...this.getBaseResult(),
      ...this.getDeprecationInfo(),
    } as PodAnalyserFileResult;
  }
}
