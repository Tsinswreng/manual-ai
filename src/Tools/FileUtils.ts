import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { promises as fs } from "fs";
import { CT } from "../CT";

/**
 * 确保文件所在的目录存在
 * @param path 文件路径
 * @param ct 取消令牌
 */
export async function ensureDir(path: string, ct?: CT): Promise<boolean> {
	const dir = dirname(path);
	const exists = existsSync(dir);
	if (!exists) {
		mkdirSync(dir, { recursive: true });
	}
	return exists;
}

/**
 * 确保文件存在，如果不存在则创建空文件
 * @param path 文件路径
 * @param ct 取消令牌
 */
export async function ensureFile(path: string, ct?: CT): Promise<boolean> {
	await ensureDir(path, ct);
	const exists = existsSync(path);
	if (!exists) {
		await fs.writeFile(path, '', 'utf8');
	}
	return exists;
}

/**
 * 异步读取文件内容
 * @param path 文件路径
 * @param ct 取消令牌
 * @returns 文件内容
 */
export async function readFile(path: string, ct: CT): Promise<string> {
	await ensureFile(path, ct);
	return await fs.readFile(path, 'utf8');
}

/**
 * 异步写入文件内容
 * @param path 文件路径
 * @param content 文件内容
 * @param ct 取消令牌
 */
export async function writeEnsuredFile(path: string, content: string, ct: CT): Promise<void> {
	await ensureDir(path, ct);
	await fs.writeFile(path, content, 'utf8');
}