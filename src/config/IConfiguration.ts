export interface ILanguageConfiguration extends IFoldConfiguration {
  defaultFoldStartRegex?: string;
  disableFolding?: boolean;

  //Latest version
  foldDefinitions?: IFoldConfiguration[];
}


export interface IFoldConfiguration {
  foldEnd: string;
  foldEndRegex: string;
  foldStart: string;
  foldStartRegex: string;
  isFoldedByDefault?: boolean;
}

export interface IConfiguration  {
  [languageName: string]: ILanguageConfiguration;
}

export interface IOptionsConfiguration {
  collapseDefaultRegionsOnOpen: boolean;
}


