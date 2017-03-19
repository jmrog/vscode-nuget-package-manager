import runFlattenNestedArrayTests from './utils/flattenNestedArray.test';

import runCreateUpdatedProjectJsonTests from './actions/shared/createUpdatedProjectJson.test';
import runHandleSearchResponseTests from './actions/add-methods/handleSearchResponse.test';
import runTruncateCsprojPath from './actions/shared/truncateCsprojPath.test';

runFlattenNestedArrayTests();
runCreateUpdatedProjectJsonTests();
runHandleSearchResponseTests();
runTruncateCsprojPath();
