import { PodFileType } from 'src/types';

export interface ComponentsUsedResult {
  componentAnalyserResults: ComponentResult[];
  componentsDeprecationsCount: number;
  componentsDeprecationsFound: string[];
}

export interface DeprecationAnalyserResult extends ComponentsUsedResult {
  path: string;
  componentsUsed: string[];
  deprecationsCount: number;
  deprecationsFound: string[];
  lintErrorsCount: number;
  lintErrorsFound: string[];
}

export interface PodAnalyserFileResult extends DeprecationAnalyserResult {
  podFileType: PodFileType;
}

export interface DirectoryResult extends DeprecationAnalyserResult {
  children: (PodResult | PodAnalyserFileResult)[];
  fileCount: number;
}

export interface ComponentResult extends DirectoryResult {
  componentName: string;
  templatePath?: string;
  componentPath?: string;
}

export interface PodResult extends DirectoryResult {
  templatePath?: string;
  routePath?: string;
  controllerPath?: string;
}

export interface ApplicationResult extends DirectoryResult {
  componentResults: ComponentResult[];
}
