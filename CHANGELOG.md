# Change Log
All notable changes to the "vscode-nuget-package-manager" extension will be documented in this file.

## [1.1.0] - 2017-04-01
- Add F#/.fsproj support

## [1.0.1, 1.0.2] - 2017-03-19
- Changes to README to remove leftover stuff (whoops)

## [1.0.0] - 2017-03-19
- Refactored to now handle workspaces containing multiple `.csproj` files 
(closes #10, closes #12)
- Adds a number of tests and automated steps to build/test process (closes #7,
closes #1)

## [0.1.1] - 2017-03-15
- Update preview images (and show both add and remove; closes #11)

## [0.1.0] - 2017-03-13
- The "I'm a Dummy and Accidentally Typed 'Minor' Instead of 'Patch' When Publishing"
release.
- No actual changes; this is identical to v0.0.4, but VS Code won't let me unpublish
specific versions and I initially typo'd the release number. :(

## [0.0.4] - 2017-03-13
- Updated "Known Issues" to mention #9, which seems important

## [0.0.3] - 2017-03-12
- Add PackageReference even if no PackageReference section already exists (closes #5)
- Add ItemGroup if no ItemGroup is found in project file
- Add tests for some operations (partial progress on #1)

## [0.0.2] - 2017-03-09
- Remove `getQueryString` utility and use Node's querystring module
- Add slightly better error handling in Promise chain
- Update versioning; vsce only allows x.x.x

## [0.0.1-alpha] - 2017-03-07
- Initial release

