# Visual Studio Code Custom Folding Extension

This extension enhances the default code folding abilities of Visual Studio Code editor. Regions of code that you'd like to be folded can be wrapped with `#region` comments.

![Custom Folding](https://raw.githubusercontent.com/maptz/Maptz.VSCode.Extensions.customfolding/master/imgs/CSharp_region_wrap.gif)

The precise format of the comment depends on the language. For instance, for C-Style languages, regions are of the form:

    /* #region Main */
    public static void Main(string args[])
    {
       //Your code goes here
    }
    /* #endregion */

For HTML style languages, you could define a fodable region with the following tags:

    <!-- #region Body -->
    <body>
    </body>
    <!-- #endregion -->

## Commands

The extension also installs a command to wrap a `region` comment around the current selection.

- regionfolder.wrapWithRegion (Ctrl+M Ctrl+R)

## Configuration

The extension provides configuration settings, allowing you to provide custom region tags for your language.

To provide a custom folding for your language create a settings in your vscode settings file that conforms to the following specification.

    "maptz.regionfolder": {
        "[ahk]": {                                      //Language selector
            foldEnd: "; #endregion",                    //Text inserted at the end of the fold
            foldEndRegex: ";[\\s]*#endregion",          //Regex used to find fold end text.
            foldStart: "; #region [NAME]",              //Text inserted at the start of the fold.
                                                        //Use the `[NAME]` placeholder to indicate
                                                        //where the cursor should be placed after
                                                        //insertion
            foldStartRegex: ";[\\s]*#region[\\s]*(.*)"  ////Regex used to find fold start text.
      }
    }

## Installing

<!-- #region  -->

You can install the latest version of the extension is available on the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=maptz.regionfolder).

Alternatively, open Visual Studio code, press `Ctrl+P` and type:

> ext install regionfolder

<!-- #endregion -->

## Bugs and Features

Please log any bugs on Github [here](https://github.com/maptz/Maptz.VSCode.Extensions.CustomFolding/issues).

If you have a new language that you've supported using the custom configuration, we'd love to incorporate it into the defaults for the extension. Please log an issue or a pull request on the repo [here](https://github.com/maptz/Maptz.VSCode.Extensions.CustomFolding/).

## Source Code

The source code is available on GitHub [here](https://github.com/maptz/Maptz.VSCode.Extensions.CustomFolding).

## Release Notes

### Version 1.0.3

- Small bug fixes and documentation updates.

### Version 1.0.2

- Added ability to provide configuration for different languages.
- Added support for `vue` [Issue #13](https://github.com/maptz/maptz.vscode.extensions.customfolding/pull/13)
- Added support for `twig` [Issue #15](https://github.com/maptz/maptz.vscode.extensions.customfolding/pull/15)
- Added support for `php` [Issue #16](https://github.com/maptz/maptz.vscode.extensions.customfolding/pull/16)

### Version 1.0.1

- Added support for `golang` [Issue #14](https://github.com/maptz/maptz.vscode.extensions.customfolding/pull/14)

### Version 1.0.0

- This is the official 1.0 release of the extension.

### Version 0.0.11

- Added support for .fish files. [Issue #9](https://github.com/maptz/maptz.vscode.extensions.customfolding/issues/9)

### Version 0.0.10

- Added support for .dart files. [Issue #8](https://github.com/maptz/maptz.vscode.extensions.customfolding/issues/8)
- Added support for .swift files. [Issue #7](https://github.com/maptz/maptz.vscode.extensions.customfolding/issues/7)

### Version 0.0.9

- Updated NPM dependencies

### Version 0.0.8

- Added support for .ahk files. [Issue #1](https://github.com/maptz/maptz.vscode.extensions.customfolding/issues/1)
- Added support for .lua files [Issue #3](https://github.com/maptz/maptz.vscode.extensions.customfolding/issues/3).
- Added support for .sql files. [Issue #4](https://github.com/maptz/maptz.vscode.extensions.customfolding/issues/4)

## Other Extensions

View other extensions from [Maptz](https://marketplace.visualstudio.com/publishers/maptz)
