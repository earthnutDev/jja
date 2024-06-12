import { question } from "ismi-command";
import { typeOf } from "ismi-js-tools";
import {
  Color,
  fileExist,
  pathJoin,
  readFileToJsonSync,
  runOtherCode,
} from "ismi-node-tools";
import { getDirectoryBy } from "./tools";

export const gitBind = {
  "git   (一些关于 git 的操作)": [
    `commit <-c> (git 提交代码，是 ${Color.red(
      "commit"
    )} 提交啊，不是 ${Color.fromRgb("push", "#666")} 推送)`,
  ],
};

export default async function (params: any) {
  if (typeOf(params) != "object") params = {};
  /** 提交代码 */
  if (params.commit) {
    await gitCommit(params.commit.join(" "));
  }
  //  else if (params)
}

/** 整理 git
 *
 * @param [commitMessage="版本维护"]  提交信息
 * @param [tag=false]  是否给提交打上 tag
 */
export async function gitCommit(
  commitMessage: string = "版本维护",
  tag: boolean = false
) {
  /// 检测当前目录下有没有  .git  文件夹
  let cwd = getDirectoryBy(".git", "directory");
  if (cwd == undefined)
    return console.log(
      Color.fromHexadecimal(
        "not a git repository（当前目录非 git 储存库）",
        "#ff0"
      )
    );
  const addResult = await runOtherCode({ code: "git add .", cwd });
  // 倘若没有成功，可能是执行目录下没有  .git
  if (!addResult.success) return console.log(addResult.error) != undefined;
  const gitStatus = await runOtherCode({ code: "git status", cwd });
  if (!/nothing to commit, working tree clean/.test(gitStatus.data)) {
    const addResult = await runOtherCode({ code: `git add .`, cwd });
    if (!addResult.success) return console.log(addResult.error) != undefined;
    if (commitMessage.trim() == "") {
      commitMessage = await question({
        text: "请输入提交信息",
        private: true,
      });
    }
    const commitResult = await runOtherCode({
      code: `git commit -m "${commitMessage}"`,
      cwd,
    });
    if (!commitResult.success)
      return console.log(commitResult.error) != undefined;
    // 打印是 stderr
    if (commitResult.error) console.log(commitResult.error);
    await runOtherCode({ code: "git push", cwd });
    // 需要打标签
    if (tag) {
      cwd = getDirectoryBy("package.json", "file", process.cwd());
      if (cwd == undefined) return true;
      const version = readFileToJsonSync(pathJoin(cwd, "package.json")).version;
      if (!version) return true;
      await runOtherCode({
        code: `git tag -a  v${version} -m '${commitMessage}' && git push origin --tag`,
        cwd,
      });
    }
    return true;
  }
  return false;
}
