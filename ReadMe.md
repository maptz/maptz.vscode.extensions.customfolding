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

To provide a custom folding for your language create a settings in your vscode settings file (either user or workspace) that conforms to the following specification.

    "maptz.regionfolder": {
        "[ahk]": {                                      //Language selector
            "foldEnd": "; #endregion",                    //Text inserted at the end of the fold
            "foldEndRegex": ";[\\s]*#endregion",          //Regex used to find fold end text.
            "foldStart": "; #region [NAME]",              //Text inserted at the start of the fold.
                                                        //Use the `[NAME]` placeholder to indicate
                                                        //where the cursor should be placed after
                                                        //insertion
            "foldStartRegex": ";[\\s]*#region[\\s]*(.*)"  ////Regex used to find fold start text.
      }
    }

## Installing

<!-- #region  -->

You can install the latest version of the extension is available on the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=maptz.regionfolder).

Alternatively, open Visual Studio code, press `Ctrl+P` and type:

> ext install regionfolder

<!-- #endregion -->

## Preliminary Features

### Default Folding region

New in version 1.0.7 is the notion of default folds. The feature is in preview, but when it is complete, default folds will define regions which will be collapsed whenever the file is opened. In the current version, default folds are only collapsed when the  `regionfolder.collapseDefault` command is issued from the command palette. 

You can create a default fold by creating a Regex expression for the language of your choice in the `defaultFoldStartRegex` property in your settings file:

```
    "maptz.regionfolder": {
        "[markdown]": {        
            "defaultFoldStartRegex": "\\<!--[\\s]*#region\\(collapsed\\)[\\s]*(.*)",
            
            "foldEnd": "<!-- #endregion -->",
            "foldEndRegex": "\\<!--[\\s]*#endregion",
            "foldStart": "<!-- #region [NAME] -->",
            "foldStartRegex": "\\<!--[\\s]*#region[\\s]*(.*)"
        }
    }
```




## Bugs and Features

The Changelog can be found [here](CHANGELOG.md).

Please log any bugs on Github [here](https://github.com/maptz/Maptz.VSCode.Extensions.CustomFolding/issues).

If you have a new language that you've supported using the custom configuration, we'd love to incorporate it into the defaults for the extension. Please log an issue or a pull request on the repo [here](https://github.com/maptz/Maptz.VSCode.Extensions.CustomFolding/).

## Source Code

The source code is available on GitHub [here](https://github.com/maptz/Maptz.VSCode.Extensions.CustomFolding).

## Other Extensions

View other extensions from [Maptz](https://marketplace.visualstudio.com/publishers/maptz)
