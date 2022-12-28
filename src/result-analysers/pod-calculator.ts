import { DirectoryResultCalculator } from './directory-calculator';
import { PodResult } from './result';

export class PodResultCalculator extends DirectoryResultCalculator {
  getResult(): PodResult | any {
    const existingResults = super.getResult();
    const childrenResults = existingResults.children;

    return {
      ...existingResults,
      templatePath: this.getPathOfChild('template', childrenResults),
      controllerPath: this.getPathOfChild('controller', childrenResults),
      routePath: this.getPathOfChild('route', childrenResults),
    } as PodResult;
  }
}
