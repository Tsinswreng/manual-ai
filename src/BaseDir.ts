import * as os from 'os';
import { IBaseInteractDir } from './IBaseDir';
import { UnixPathNormalizer } from './Tools/UnixPathNormalizer';
import path from 'path';

export class BaseInteractDir implements IBaseInteractDir{
	static inst = new this();
	get baseInteractDir():string{
		const dir = path.join(os.homedir(), '.ManualAi')
		return UnixPathNormalizer.inst.normalizePath(dir)
	}
}
