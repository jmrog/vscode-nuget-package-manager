# vscode-nuget-package-manager

An extension for Visual Studio Code that lets you easily add or remove 
.NET Core 1.1+ package references to/from your project's `.csproj` file
using Code's Command Palette.

**NOTE:** THIS EXTENSION IS IN **_ALPHA_** STATUS. It seems to work for me,
but it **may break for you**, and it makes a number of assumptions (some listed
below) that may not be true in all cases. Please feel free to report
issues. There are still lots of things TODO.

## Features

- Search the NuGet package repository for packages using either (partial
or full) package name or another search term.
- Add PackageReference dependencies to your .NET Core 1.1+ `.csproj` file
from Visual Studio Code's Command Palette.

![Adding a Package](https://github.com/jmrog/vscode-nuget-package-manager/raw/master/images/add-package.gif)

- Remove installed packages from your project's `.csproj` file via Visual
Studio Code's Command Palette.

![Removing a Package](https://github.com/jmrog/vscode-nuget-package-manager/raw/master/images/remove-package.gif)

## Known Issues

- The XML-to-JavaScript parser that this extension uses currently strips out
comments from the `.csproj` file. Unfortunately, there is no way around this
at the moment, but the eventual plan is to replace this dependency.
- This extension only works with `.csproj` files for now; it may also
support (deprecated) `project.json` files in the future.
- The extension assumes that your project's `.csproj` file has the same
name as the directory name in which your project resides.
- The extension does not add DotNetCliToolsReference entries for tools.

## Release Notes

### 0.1.0
- The "I'm a Dummy and Accidentally Typed 'Minor' Instead of 'Patch' When Publishing"
release. 
- No actual changes; this is identical to v0.0.4, but VS Code won't let me unpublish
specific versions and I initially typo'd the release number. :(

### 0.0.4
- Updated "Known Issues" to mention #9, which seems important

### 0.0.3
- Add PackageReference even if no PackageReference section already exists (closes #5)
- Add ItemGroup if no ItemGroup is found in project file
- Add tests for some operations (partial progress on #1)

### 0.0.2
- Remove `getQueryString` utility and use Node's querystring module
- Add slightly better error handling in Promise chain
- Update versioning; vsce only allows x.x.x

### 0.0.1-alpha

Initial release.

