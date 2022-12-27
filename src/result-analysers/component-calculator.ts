import { DirectoryTree } from 'directory-tree';
import { DirectoryResultCalculator } from './directory-calculator';
import { ComponentResult } from './result';

export class ComponentResultCalculator extends DirectoryResultCalculator {
  get childTrees(): DirectoryTree[] {
    return this.podFileTree.children.filter((a) => a.name === 'component.js' || a.name === 'template.hbs');
  }

  getResult(): ComponentResult {
    const results = super.getResult();
    const childrenResults = results.children;
    const componentName = this.context.getComponentNameForPath(this.podFileTree.path);

    return {
      ...super.getResult(),
      componentName,
      templatePath: this.getPathOfChild('template', childrenResults),
      componentPath: this.getPathOfChild('component', childrenResults),
    } as ComponentResult;
  }
}
