import * as expect from 'expect';
import * as fs from 'fs';
import * as path from 'path';
import { createUpdatedProjectJson } from '../../../src/actions/shared';

const mockProjectName = 'MockProject';
const mockProjectVersion = '1.0.0';
const mockPath = path.join(__dirname, '..', '..', 'mocks');

/**
 * Helper method for common test functionality.
 * @param {Array<any>} packageRefSection
 */
function checkPackageReference(packageRefSection: Array<any>, index = 0) {
    expect(packageRefSection).toExist('Created JSON has a PackageReference');

    const packageReference = packageRefSection[index];

    expect(packageReference.$.Include).toBe(mockProjectName, 'Created JSON has right project name');
    expect(packageReference.$.Version).toBe(mockProjectVersion, 'Created JSON has right project version');
}

export default function runCreateUpdatedProjectJsonTests() {
    // TODO: tests to insure that existing package references are updated rather than adding duplicates
    describe('createUpdatedProjectJson', function () {
        it('should handle standard .csproj JSON', function () {
            const json = JSON.parse(fs.readFileSync(`${mockPath}/Standard.json`, 'utf8'));
            const result = createUpdatedProjectJson(json, mockProjectName, mockProjectVersion);
            const itemGroups = result.Project.ItemGroup;
            checkPackageReference(itemGroups[itemGroups.length - 1].PackageReference, 2);
        });

        it('should handle .csproj files with no PackageReference tags', function () {
            const json = JSON.parse(fs.readFileSync(`${mockPath}/NoPackageReferences.json`, 'utf8'));
            const result = createUpdatedProjectJson(json, mockProjectName, mockProjectVersion);
            const itemGroups = result.Project.ItemGroup;
            checkPackageReference(itemGroups[itemGroups.length - 1].PackageReference);
        });

        it('should handle .csproj files with no ItemGroup tags', function () {
            const json = JSON.parse(fs.readFileSync(`${mockPath}/NoItemGroups.json`, 'utf8'));
            const result = createUpdatedProjectJson(json, mockProjectName, mockProjectVersion);
            const itemGroups = result.Project.ItemGroup;

            expect(itemGroups).toExist('Created JSON has an ItemGroup');

            checkPackageReference(itemGroups[itemGroups.length - 1].PackageReference);
        });

        it('should throw for .csproj files lacking a Project tag', function () {
            const json = JSON.parse(fs.readFileSync(`${mockPath}/NoProject.json`, 'utf8'));
            expect(() => createUpdatedProjectJson(json, mockProjectName, mockProjectVersion)).toThrow();
        });

        it('should throw for empty files/`null` JSON values', function () {
            const json = JSON.parse(fs.readFileSync(`${mockPath}/Empty.json`, 'utf8'));
            expect(() => createUpdatedProjectJson(json, mockProjectName, mockProjectVersion)).toThrow();
        });

        it('should not modify passed-in JSON', function () {
            const json = JSON.parse(fs.readFileSync(`${mockPath}/NoItemGroups.json`, 'utf8'));
            const result = createUpdatedProjectJson(json, mockProjectName, mockProjectVersion);
            const itemGroups = result.Project.ItemGroup;

            expect(itemGroups).toExist('Created JSON has an ItemGroup');
            expect(json.Project.ItemGroup).toNotExist('Original JSON is not modified');
        });
    });
}
