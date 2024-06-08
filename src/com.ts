import { Color } from "ismi-node-tools";
import { Command } from "ismi-command";

/** 导出绑定信息，放这个文件夹为了方便看 */
export const updateBind = {
  "update <u> (做一个简单的 npm 升级程序，对，简单的)": [
    "--ignore <-i> (不建议你这么用,你会发现你像个傻子一样在那等结果)",
    `--git-commit <-g> (git 提交代码，是 ${Color.red("commit")} 提交啊，不是 ${Color.random("push")} 推送)`,
    `--dependencies <-d> (更新依赖，跟 ${Color.random("npm update")} 一样，但是对我自己很有用)`,
    "--npm-publish <-n> (用于 npm 包的升级（自带 git 清理，不三克）)",
  ],
};

/** 导出删除文件的绑定信息    */
export const removeBind = {
  "remove <r> (做一个简单的兼容的移除文件或文件夹的命令)": [
    "--ignore <-i> (不打印日志（默认打印的）)",
    "--subdirectories <-s> (这是一个危险的命令，用于 windows 下递归删除执行命令下所有的给定文件名称)",
  ],
};

/** 到处包管理的绑定信息 */
export const packageBind = {
  "package <p>  (包管理)": [
    "diff <-d>  (分析当下包的差异)"
  ]
}

/** 到处清理屏幕的信息 */
export const clearScreenBind = {
  "clearScreen <cls> (清理屏幕)": ""
}

// 初始化一个命令
const command: Command = new Command("ismi");
// 绑定命令
command
  .bind({
    ...removeBind,
    ...updateBind,
    ...packageBind,
    ...clearScreenBind
  })
  .run()
  .isEnd
  .end;

export default command;
