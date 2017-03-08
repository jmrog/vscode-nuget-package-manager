# vscode-nuget-package-manager

An extension for Visual Studio Code that lets you easily add or remove 
.NET Core 1.1+ package references to/from your project's `.csproj` file
using Code's Command Palette.

**NOTE:** This extension is in _alpha_ status. It seems to work for me,
but may break for you, and it makes a number of assumptions (some listed
below) that may not be true in all cases. Please feel free to report
issues.

## Features

- Search the NuGet package repository for packages using either (partial
or full) package name or another search term.
- Add PackageReference dependencies to your .NET Core 1.1+ `.csproj` file
from Visual Studio Code's Command Palette.
- Remove installed packages from your project's `.csproj` file via Visual
Studio Code's Command Palette.

## Known Issues

- This extension only works with `.csproj` files for now; it may also
support (deprecated) `project.json` files in the future.
- The extension assumes that your project's `.csproj` file has the same
name as the directory name in which your project resides.
- The extension does not add DotNetCliToolsReference entries for tools.

## Release Notes

### 0.0.1-alpha

Initial release.

