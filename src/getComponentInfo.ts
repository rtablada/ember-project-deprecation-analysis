import unusedComponentsUtils from 'ember-unused-components/lib/utils';
import analyser from 'ember-unused-components/lib/analyser';

export type ComponentResults = Record<string, ComponentInfo>;

export interface ComponentInfo {
  key: string;
  name: string;
  type: 'component';
  parentKey: string;
  subComponentKeys: SubComponentKeys;
  isSubComponent: boolean;
  stats: Stats;
  occurrences: Occurrence[];
  filePaths: string[];
  fileType: string;
}

interface Occurrence {
  file: string;
  fileType: string;
  type: 'curly' | 'angle';
  lines: string[];
  key: string;
}

interface Stats {
  count: number;
  js: number;
  curly: number;
  angle: number;
  componentHelper: number;
}

type SubComponentKeys = Record<string, boolean>;

export function getComponentInfo(projectPath: string): ComponentResults {
  const argv = { path: projectPath };
  const config = unusedComponentsUtils.getConfig(argv);
  analyser.mapComponents(config);
  analyser.scanProject(config);

  return analyser.components;
}
