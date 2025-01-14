import { createLogger } from '@smtp2graph/common/src/Logger';

export const { log, prefixedLog } = createLogger('webserver', DEBUG?'verbose':'info');
