import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { promises as fs } from "fs";
import { CT } from "../CT";

/**
 * 确保文件所在的目录存在
 * @param path 文件路径
 * @param ct 取消令牌
 */
export async function ensureDir(path: string, ct: CT): Promise<void> {
    const dir = dirname(path);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}

/**
 * 确保文件存在，如果不存在则创建空文件
 * @param path 文件路径
 * @param ct 取消令牌
 */
export async function ensureFile(path: string, ct: CT): Promise<void> {
    await ensureDir(path, ct);
    if (!existsSync(path)) {
        await fs.writeFile(path, '', 'utf8');
    }
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
export async function writeFile(path: string, content: string, ct: CT): Promise<void> {
    await ensureDir(path, ct);
    await fs.writeFile(path, content, 'utf8');
}