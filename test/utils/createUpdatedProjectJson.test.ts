import * as assert from 'assert';
import * as fs from 'fs';
import { createUpdatedProjectJson } from '../../src/utils';

const mockProjectName = 'MockProject';
const mockProjectVersion = '1.0.0';

/**
 * Helper method for common test functionality.
 * @param {Array<any>} packageRefSection
 */
function checkPackageReference(packageRefSection: Array<any>, index = 0) {
    assert.ok(packageRefSection, 'Created JSON has a PackageReference');

    const packageReference = packageRefSection[index];

    assert.strictEqual(packageReference.$.Include, mockProjectName, 'Created JSON has right project name');
    assert.strictEqual(packageReference.$.Version, mockProjectVersion, 'Created JSON has right project version');
}

// TODO: Create gulp task to move mocks to right directory before testing.
export default function runCreateUpdatedProjectJsonTests() {
    // TODO: tests to insure that existing package references are updated rather than adding duplicates
    suite('createUpdatedProjectJson Tests', function () {
        test('Standard .csproj JSON', function () {
            const json = JSON.parse(fs.readFileSync(__dirname + '/../../../test/mocks/Standard.json', 'utf8'));
            const result = createUpdatedProjectJson(json, mockProjectName, mockProjectVersion);
            const itemGroups = result.Project.ItemGroup;
            checkPackageReference(itemGroups[itemGroups.length - 1].PackageReference, 2);
        });

        test('No PackageReference tags', function () {
            const json = JSON.parse(fs.readFileSync(__dirname + '/../../../test/mocks/NoPackageReferences.json', 'utf8'));
            const result = createUpdatedProjectJson(json, mockProjectName, mockProjectVersion);
            const itemGroups = result.Project.ItemGroup;
            checkPackageReference(itemGroups[itemGroups.length - 1].PackageReference);
        });

        test('No ItemGroup tags', function () {
            const json = JSON.parse(fs.readFileSync(__dirname + '/../../../test/mocks/NoItemGroups.json', 'utf8'));
            const result = createUpdatedProjectJson(json, mockProjectName, mockProjectVersion);
            const itemGroups = result.Project.ItemGroup;

            assert.ok(itemGroups, 'Created JSON has an ItemGroup');

            checkPackageReference(itemGroups[itemGroups.length - 1].PackageReference);
        });

        test('No Project tag', function () {
            const json = JSON.parse(fs.readFileSync(__dirname + '/../../../test/mocks/NoProject.json', 'utf8'));
            assert.throws(() => createUpdatedProjectJson(json, mockProjectName, mockProjectVersion), 'Throws');
        });

        test('Empty file/`null` JSON', function () {
            const json = JSON.parse(fs.readFileSync(__dirname + '/../../../test/mocks/Empty.json', 'utf8'));
            assert.throws(() => createUpdatedProjectJson(json, mockProjectName, mockProjectVersion), 'Throws');
        });
    });
}
