

export interface IChangedFileMap{
	unixMs:number
	/**
	 * AI改過之後之 完整的 新文件
	 * 建議用sha256作文件名
	 */
	newFile: string
	/**
	 * 對應到文件的路徑
	 * 相對于 工作區根目錄
	 */
	oldFile: string
}



export interface IChanges{
	changes: IChangedFileMap[]
}