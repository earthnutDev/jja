import { fileExist, pathJoin } from "ismi-node-tools";
import { path } from "ismi-node-tools";

/** 根据给定的文件或文件夹名称找到父级目录 
 * 
 * future 该方法为 node-tools 未发布方法
 *  
 * ```ts
 *  
 * const result = getDirectoryBy('package.json'); 
 * 
 * // 倘若 package.json 文件为兄弟目录
 * 
 * console.log(result); // process.cwd();
 * 
 * // 倘若当前文件链并不会存在 package.json 则
 * 
 * console.log(result); // undefined
 * 
 * ```
 * @param target  目标文件或文件夹
 * @param type 当前设定目标的类型：文件 `file` 或是文件夹 `directory`
 * @param [originalPath='']  查找的原始路径
 * 
 * @returns 在捕获到目标后会返回目标，否则则返回 undefined
*/
export function getDirectoryBy(target: string, type: "file" | "directory" = 'file', originalPath: string = ''): string | undefined {
    // 当前工作目录
    let cwd: string = originalPath || process.cwd();
    // 查看当前工作目录是否存在
    const cwdIsExist = fileExist(cwd);
    // 倘若 cwd 不存在（只要针对于传入参数的情况）
    if (!cwdIsExist) return "";
    if (cwdIsExist.isFile()) cwd = path.dirname(cwd);
    else if (!cwdIsExist.isDirectory()) return "";
    do {
        // 目标文件
        let fileTest = fileExist(pathJoin(cwd, target));
        // 判断文件
        if (fileTest && (type == 'file' && fileTest.isFile() || type == 'directory' && fileTest.isDirectory())) return cwd;
        cwd = pathJoin(cwd, '..');
    } while (cwd !== pathJoin(cwd, '..'));
    return "";
}