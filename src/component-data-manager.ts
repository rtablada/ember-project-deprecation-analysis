import { AnalyserContext } from './analyser-context';
import { ComponentResults } from './getComponentInfo';
import { camelCase, toUpper } from 'lodash';
import path from 'path';

const pascalCase = (str) => camelCase(str).replace(/^(.)/, toUpper);

interface ComponentLookup {
  componentName: string;
  relativePath: string;
  fullPath: string;
  componentOccurancePaths: string[];
}

export default class ComponentDataManager {
  context: AnalyserContext;
  componentResults: ComponentResults;
  protected componentLookups: ComponentLookup[];

  constructor(context: AnalyserContext, componentResults: ComponentResults) {
    this.context = context;
    this.componentResults = componentResults;
  }

  analyseComponentData(): void {
    this.componentLookups = Object.keys(this.componentResults).map((componentKey) => {
      const componentInfo = this.componentResults[componentKey];
      const componentName = this.angleBracketify(componentInfo.name);

      return {
        componentName: componentName,
        fullPath: path.dirname(componentInfo.filePaths[0]),
        relativePath: this.context.getDirectoryPath(componentInfo.filePaths[0]),
        componentOccurancePaths: componentInfo.occurrences.map((occ) => this.context.getRelativePath(occ.file)),
      };
    });
  }

  getComponentPaths(): string[] {
    return this.componentLookups.map((a) => a.fullPath);
  }

  angleBracketify(curlyComponentName: string): string {
    return curlyComponentName.split('/').map(pascalCase).join('::');
  }

  getComponentsUsedForPath(relativePath: string): string[] {
    const result = this.componentLookups
      .filter((a) => a.componentOccurancePaths.includes(relativePath))
      .map((a) => a.componentName);

    return result;
  }

  getComponentNameForPath(path: string): string {
    return this.componentLookups.find((c) => c.fullPath === path)?.componentName;
  }
}
