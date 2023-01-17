import *  as IConfig from "./IConfiguration";

export let defaultOptionsConfiguration: IConfig.IOptionsConfiguration = {
  collapseDefaultRegionsOnOpen: true
};

export let defaultConfiguration: IConfig.IConfiguration = {
  "[ansible]": {
    foldEnd: "# endregion",
    foldEndRegex: "[\\s]*#[\\s]*endregion",
    foldStart: "# region [NAME]",
    foldStartRegex: "^[\\s]*#[\\s]*region[\\s]*(.*)[\\s]*$"
  },
  "[ahk]": {
    foldEnd: "; #endregion",
    foldEndRegex: ";[\\s]*#endregion",
    foldStart: "; #region [NAME]",
    foldStartRegex: ";[\\s]*#region[\\s]*(.*)"
  },
  "[aspnetcorerazor]": {
    foldEnd: "@* //#endregion *@",
    foldEndRegex: "@\\*[\\s]*//[\\s]*#endregion",
    foldStart: "@* //#region [NAME]*@",
    foldStartRegex: "@\\*[\\s]*//[\\s]*#region[\\s]*(.*)"
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
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$",
    defaultFoldStartRegex: "^[\\s]*/\\*[\\s]*#regiond[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[css]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[cmake]": {
    foldEnd: "# endregion",
    foldEndRegex: "[\\s]*#[\\s]*endregion",
    foldStart: "# region [NAME]",
    foldStartRegex: "^[\\s]*#[\\s]*region[\\s]*(.*)[\\s]*$"
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
  "[javascriptreact]": {
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
  "[jsonc]": {
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
    defaultFoldStartRegex: "\\<!--[\\s]*#region\\(collapsed\\)[\\s]*(.*)",
    foldStartRegex: "\\<!--[\\s]*#region[\\s]*(.*)"
  },
  "[oraclesql]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/* [\\s]*#endregion [\\s]*(.*)*/",
    foldStart: "/* #region [NAME] */",
    foldStartRegex: "/* [\\s]*#region[\\s]*(.*)*/",
  },
  "[php]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[powershell]": {
    foldEnd: "# endregion",
    foldEndRegex: "[\\s]*#[\\s]*endregion",
    foldStart: "# region [NAME]",
    foldStartRegex: "^[\\s]*#[\\s]*region[\\s]*(.*)[\\s]*$"
  },
  "[python]": {
    foldEnd: "# endregion",
    foldEndRegex: "[\\s]*#[\\s]*endregion",
    foldStart: "# region [NAME]",
    foldStartRegex: "^[\\s]*#[\\s]*region[\\s]*(.*)[\\s]*$"
  },
  "[r]": {                                      //Language selector
    foldEnd: "#endregion",
    foldEndRegex: "[\\s]*#endregion",
    foldStart: "#region [NAME]",
    foldStartRegex: "[\\s]*#region[\\s]*(.*)"
  },
  "[ruby]": {                                      //Language selector
    foldEnd: "#endregion",
    foldEndRegex: "[\\s]*#endregion",
    foldStart: "#region [NAME]",
    foldStartRegex: "[\\s]*#region[\\s]*(.*)"
  },
  "[rust]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[sass]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[scss]": {
    foldEnd: "/* #endregion */",
    foldEndRegex: "/\\*[\\s]*#endregion",
    foldStart: "/* #region  [NAME] */",
    foldStartRegex: "^[\\s]*/\\*[\\s]*#region[\\s]*(.*)[\\s]*\\*/[\\s]*$"
  },
  "[shellscript]": {
    foldEnd: "#endregion",
    foldEndRegex: "[\\s]*#endregion",
    foldStart: "#region [NAME]",
    foldStartRegex: "[\\s]*#region[\\s]*(.*)"
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
  '[typescriptreact]': {
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
  },
  "[yaml]": {
    foldEnd: "# endregion",
    foldEndRegex: "[\\s]*#[\\s]*endregion",
    foldStart: "# region [NAME]",
    foldStartRegex: "^[\\s]*#[\\s]*region[\\s]*(.*)[\\s]*$"
  },
  "[yuml]": {
    foldEnd: "// #endregion",
    foldEndRegex: "//[\\s]*#endregion",
    foldStart: "// #region [NAME]",
    foldStartRegex: "^[\\s]*//[\\s]*#region[\\s]*(.*)[\\s]*$"
  }
};
