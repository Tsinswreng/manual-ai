import { IPathNormalizer } from "./IPathNormalizer";


export class UnixPathNormalizer implements IPathNormalizer{
	static inst = new this();
	/**
	 * 在原路徑的基礎上
	 * 所有斜槓都用正斜槓
	 * 建議如果目錄是文件夾則末尾要有一個斜槓、但判斷是否爲目錄要實際IO。判斷不了是不是文件夾就算了
	 * 其餘不變
	 */
	normalizePath(path: string): string {
		return path.replace(/\\/g, "/");
	}
}
