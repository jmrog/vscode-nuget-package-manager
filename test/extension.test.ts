import runFlattenNestedArrayTests from './utils/flattenNestedArray.test';
import runGetProjFileExtensionTests from './utils/getProjFileExtension.test';

import runCreateUpdatedProjectJsonTests from './actions/shared/createUpdatedProjectJson.test';
import runHandleSearchResponseTests from './actions/add-methods/handleSearchResponse.test';
import runTruncateProjFilePathTests from './actions/shared/truncateProjFilePath.test';

runFlattenNestedArrayTests();
runGetProjFileExtensionTests();
runCreateUpdatedProjectJsonTests();
runHandleSearchResponseTests();
runTruncateProjFilePathTests();
