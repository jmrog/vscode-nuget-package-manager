import { projFileExtensionMatcher } from '../constants';

export default function getProjFileExtension(projFile: string): string | void {
    return (projFile.match(projFileExtensionMatcher) || [])[1];
}
