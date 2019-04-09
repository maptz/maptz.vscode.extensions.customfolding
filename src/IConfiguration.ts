export interface ILanguageConfiguration {
  foldEnd: string;
  foldEndRegex: string;
  foldStart: string;
  foldStartRegex: string;
}

export interface IConfiguration {
  [languageName: string]: ILanguageConfiguration;
}

export let DefaultConfiguration :IConfiguration = {
  "[ahk]": {
    foldEnd: "; #endregion",
    foldEndRegex: ";[\\s]*#endregion",
    foldStart: "; #region [NAME]",
    foldStartRegex: ";[\\s]*#region[\\s]*(.*)"
  },
  "[c]": {
    foldEnd: "// #endregion",
    foldEndRegex: "//[\\s]*#endregion",
    foldStart: "// #region [NAME]",
    foldStartRegex: "^[\\s]*//[\\s]*#region[\\s]*(.*)[\\s]*$"
  },
  "[cpp]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[csharp]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[css]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[dart]": {
    foldEnd: "// #endregion",
    foldEndRegex: "//[\\s]*#endregion",
    foldStart: "// #region [NAME]",
    foldStartRegex: "//[\\s]*#region[\\s]*(.*)"
  },
  "[fish]": {
    foldEnd: "#endregion",
    foldEndRegex: "[\\s]*#endregion",
    foldStart: "#region [NAME]",
    foldStartRegex: "[\\s]*#region[\\s]*(.*)"
  },
  "[go]": {
    foldEnd: "// #endregion",
    foldEndRegex: "//[\\s]*#endregion",
    foldStart: "// #region [NAME]",
    foldStartRegex: "//[\\s]*#region[\\s]*(.*)"
  },
  "[html]": {
    foldEnd: "<!-- #endregion -->",
    foldEndRegex: "\\<!--[\\s]*#endregion",
    foldStart: "<!-- #region [NAME] -->",
    foldStartRegex: "\\<!--[\\s]*#region[\\s]*(.*)"
  },
  "[javascript]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[java]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[json]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[lua]": {
    foldEnd: "--#endregion",
    foldEndRegex: "--[\\s]*#endregion",
    foldStart: " --#region [NAME]",
    foldStartRegex: "--[\\s]*#region[\\s]*(.*)"
  },
  "[less]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[markdown]": {
    foldEnd: "<!-- #endregion -->",
    foldEndRegex: "\\<!--[\\s]*#endregion",
    foldStart: "<!-- #region [NAME] -->",
    foldStartRegex: "\\<!--[\\s]*#region[\\s]*(.*)"
  },
  "[php]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[sql]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[swift]": {
    foldEnd: "// #endregion",
    foldEndRegex: "//[\\s]*#endregion",
    foldStart: "// #region [NAME]",
    foldStartRegex: "//[\\s]*#region[\\s]*(.*)"
  },
  "[typescript]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[twig]": {
    foldEnd: "<!-- #endregion -->",
    foldEndRegex: "\\<!--[\\s]*#endregion",
    foldStart: "<!-- #region [NAME] -->",
    foldStartRegex: "\\<!--[\\s]*#region[\\s]*(.*)"
  },
  "[vue]": {
    foldEnd: "<!-- #endregion -->",
    foldEndRegex: "\\<!--[\\s]*#endregion",
    foldStart: "<!-- #region [NAME] -->",
    foldStartRegex: "\\<!--[\\s]*#region[\\s]*(.*)"
  }
};
