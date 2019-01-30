# Visual Studio Code Custom Folding Extension

This extension enhances the default code folding abilities of Visual Studio Code editor. Regions of code that you'd like to be folded can be wrapped with `#region` comments. 

![Custom Folding](https://raw.githubusercontent.com/maptz/Maptz.VSCode.Extensions.customfolding/master/imgs/CSharp_region_wrap.gif)

The precise format of the comment depends on the language. There are currently two styles of comments: 

-  `/* #region [optional region name] */` 
- `<!-- #region [optional region name] -->`

For instance, for a C# document, you can define a foldable region with the following tags: 

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

> The extension is still alpha quality, so please do log any bugs on Github [here](https://github.com/maptz/Maptz.VSCode.Extensions.CustomFolding/issues).

## Commands

The extension also installs a command to wrap a `region` comment around the current selection. 

- regionfolder.wrapWithRegion (Ctrl+M Ctrl+R)

## Installing

You can install the latest version of the extension is available on the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=maptz.regionfolder).

Alternatively, open Visual Studio code, press `Ctrl+P` and type:

> ext install regionfolder

## Source Code

The source code is available on GitHub [here](https://github.com/maptz/Maptz.VSCode.Extensions.CustomFolding).

## Release Notes

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