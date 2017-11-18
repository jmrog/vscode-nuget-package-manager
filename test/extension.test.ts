import runFlattenNestedArrayTests from './utils/flattenNestedArray.test';
import runGetProjFileExtensionTests from './utils/getProjFileExtension.test';
import runGetFetchOptionsTests from './utils/getFetchOptions.test';
import runIsHeadlessXMLTests from './utils/isHeadlessXML.test';

import runCreateUpdatedProjectJsonTests from './actions/shared/createUpdatedProjectJson.test';
import runHandleSearchResponseTests from './actions/add-methods/handleSearchResponse.test';
import runTruncateProjFilePathTests from './actions/shared/truncateProjFilePath.test';

runFlattenNestedArrayTests();
runGetProjFileExtensionTests();
runGetFetchOptionsTests();
runIsHeadlessXMLTests();
runCreateUpdatedProjectJsonTests();
runHandleSearchResponseTests();
runTruncateProjFilePathTests();
