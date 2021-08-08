import { toKeyPathPair } from '../utils/toKeyPathPair';
import { PRELOAD_NAMES } from './PRELOAD_NAMES';

export const KEY_PATH_PAIRS = PRELOAD_NAMES.map(toKeyPathPair);
