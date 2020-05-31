export interface ILanguageConfiguration {
  foldEnd: string;
  foldEndRegex: string;
  foldStart: string;
  foldStartRegex: string;
  defaultFoldStartRegex?: string;
  disableFolding?: boolean;
}

export interface IConfiguration {
  [languageName: string]: ILanguageConfiguration;
}

export interface IOptionsConfiguration{
  collapseDefaultRegionsOnOpen: boolean;
}

export let DefaultOptionsConfiguration : IOptionsConfiguration = {
  collapseDefaultRegionsOnOpen: true
};

