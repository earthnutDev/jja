import { t, typeOf } from "ismi-js-tools";
import { Color, readFileToJsonSync, runOtherCode } from "ismi-node-tools";
import command from "./com";
import { selection } from "ismi-command";

// command.end;
const { stdout } = process;
/** 升级的数据 */
let data = {
  /** 指定 npm 要升级 */
  npmUpdate: false,
  /** 是否打印信息 */
  log: true,
  /** git 提交 */
  gitCommit: false,
};

/** 打印日志 */
function print(str: string) {
  data.log && console.log(str);
  return true;
}

/** 这里重新定义了 cursorUp ，因为要清理旧的显示 */
function cursorMoveUp(): boolean {
  data.log && stdout.write(`${t}1A${t}J`);
  return true;
}

/**  导出一个 */
export default async function update(
  param: string | true | string[] | { [key: string]: string | true | string[] }
) {
  if (typeOf(param) == "object") {
    // @ts-ignore
    let npm: string | true | string[] | undefined = param["--npm-publish"],
      // @ts-ignore
      git: string | true | string[] | undefined = param["--git-commit"],
      // @ts-ignore
      dependencies = Boolean(param["--dependencies"]);
    // @ts-ignore
    data.log = !Boolean(param["--ignore"]);
    const value =
      Object.values(param)
        .join(" ")
        .replace(/,/, " ")
        .replace(/true/, "")
        .replace(/  /, " ") || "修复已知问题";
    // 打算升级 npm 版本
    if (Boolean(npm)) {
      data.npmUpdate = true;
      return await updateNpm(value);
    } else {
      /** 需要更新 git */
      git && (await manageGit(value));
      /** 需要更新 依赖 */
      dependencies && (await updateDependence());
    }
  } else {
    // 用户没有任何输入，则展示默认帮助文档
    command.help("update");
  }
}
/** 升级 npm */
async function updateNpm(value: any) {
  print(Color.cyan("开始初始化"));
  /** 更新依赖  */
  await updateDependence();
  command.end;
  // 整理 git
  await manageGit(value);
  print(
    Color.cyan(`请等待更新包（你的 package.json 的 scripts 最好有 build 命令）`)
  );
  await runOtherCode({ code: `npm run build` });
  cursorMoveUp();
  print(Color.green(`打包完成`));

  print(Color.cyan(`请选择本次更新版本的类型`));
  const selectVersionType = await selection(
    {
      info: "请选择本次更新版本的类型",
      data: [
        "修补 bug",
        "添加新内容",
        "迭代更新",
        "测试版本",
        "内测版本",
        "公测版本",
        "候选版本",
      ],
      resultText: "好的，你选择的版本更新模式为",
    },
    "number"
  );
  const versionType: string[] = [
    "patch",
    "minor",
    "major",
    "prepatch",
    "prepminor",
    "premajor",
    "prerelease",
  ];
  print(Color.green(`请等待整理版本内容`));
  const versionUpResult = await runOtherCode(
    `npm version ${versionType[Number(selectVersionType)]}`
  );
  cursorMoveUp();
  print(Color.green(`版本整理完毕，准备上到 npm`));
  await runOtherCode({ code: "npm publish" });
  print(Color.green(`上推 npm 包完毕`));
}

/** 升级依赖 */
async function updateDependence() {
  const dependencies = readFileToJsonSync("package.json").dependencies || {};
  cursorMoveUp();
  print(Color.green("初始化完成，等待下一步命令"));
  for (let i = Object.keys(dependencies), j = i.length, k = 0; k < j; k++) {
    const currentEle = i[k];
    print(Color.cyan(`正在更新依赖 ${currentEle}`));
    const result = await runOtherCode({
      code: `npm install ${currentEle}@latest`,
    });
    console.log(result);

    cursorMoveUp();
    print(Color.green(`依赖 ${currentEle} 更新完毕`));
  }

  print(Color.cyan(`正在更新 dev 依赖`));
  await runOtherCode({ code: `npm update --save` });
  cursorMoveUp();
  print(Color.green(`开发依赖更新完毕`));
}

/** 整理 git  */
async function manageGit(template: string) {
  print(Color.cyan(`正在整理 git 内容`));
  const gitStatus = await runOtherCode(`git status`);
  if (!/nothing to commit, working tree clean/.test(gitStatus.data)) {
    await runOtherCode({ code: `git add .` });
    await runOtherCode({ code: `git commit -m "${template}"` });
    cursorMoveUp();
    data.gitCommit = true;
    print(Color.green(`git 内容整理完毕`));
  } else {
    print("git 工作区很干净");
  }
}
