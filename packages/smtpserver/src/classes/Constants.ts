import { createLogger } from '@smtp2graph/common/src/Logger';
import { Config } from "@smtp2graph/common/src/Config";

export class UnrecoverableError extends Error { }

export const { log, prefixedLog } = createLogger('smtpserver', DEBUG?'verbose':'info');

export const StaticConfig = new Config();
