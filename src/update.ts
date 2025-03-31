import { _p, getDirectoryBy, runOtherCode } from 'a-node-tools';
import { question, selection } from 'a-command';
import command from './command';
import { gitCommit } from './git';
import { diffPackage, updateDependence } from './package';
import { ArgsMapItemType } from 'a-command/types/args';
import pen from 'color-pen';

/**  绿色🖊️  */
const greenPen = pen.green;

/** 导出绑定信息，放这个文件夹为了方便看 */
export const updateBind = {
  'update <up> (做一个简单的 npm 升级程序，对，简单的)': [
    '--ignore <-i> (不建议你这么用,你会发现你像个傻子一样在那等结果)',
    `--dependencies <-d> (更新依赖，跟 ${pen.random('npm update')} 一样)`,
    '--npm-publish <-n> (用于 npm 包的升级（自带 git 清理，不三克）)',
  ],
};

/** 升级的数据 */
const data = {
  /** 指定 npm 要升级 */
  npmUpdate: false,
  /** 是否在执行的过程中打印信息 */
  log: true,
  /** 是否执行了 git 提交 */
  gitCommit: false,
};

/**  导出一个升级包 */
export default async function update(param: ArgsMapItemType) {
  // 用户没有任何输入，则展示默认帮助文档
  if (Object.keys(param).length == 0) return command.help('update');
  // 是否想升级 npm
  const npm: (boolean | string | number)[] = param['--npm-publish'],
    // 是否为依赖更新
    dependencies = Boolean(param['--dependencies']);
  // 是否在执行的过程中打印信息
  data.log = !param['--ignore'];
  // 打算升级 npm 版本
  if (npm) {
    data.npmUpdate = true;
    return await updateNpm();
  } else {
    /** 需要更新 依赖 */
    dependencies && (await updateDependence(data.log));
  }
}
/** 升级 npm */
async function updateNpm() {
  print(pen.hex('#9ff')('开始初始化'));
  //   不自动更新依赖
  (await question({
    text: '更新依赖',
    tip: ['跳过', '更新'],
    private: true,
  })) == '更新' && (await updateDependence(data.log));
  print(
    pen.hex('#666')(
      `请等待更新包（你的 package.json 的 scripts 最好有 build 命令）`,
    ),
  );
  const rebuild = await runOtherCode('npm run build');
  if (!rebuild.success) {
    console.log(rebuild.error);
    command.end;
  }
  print(greenPen(`打包完成`));
  /** 版本预估 */
  if (!(await versionMange())) command.error;
  print(greenPen(`版本整理完毕，准备上到 npm`));
  // 整理 git
  if (
    (await question({ text: '是否需要提交代码？', tip: ['跳过', '提交'] })) ==
    '提交'
  ) {
    const commitMessage = await question({ text: '提交说明', private: true });
    await manageGit(commitMessage);
  }
  await runOtherCode('npm publish');
  print(greenPen(`上推 npm 包完毕`));
}

/** 整理 git  */
async function manageGit(commitMessage: string) {
  print(pen.cyan(`正在整理 git 内容`));
  if (await gitCommit(commitMessage, true)) {
    data.gitCommit = true;
    print(greenPen(`git 内容整理完毕`));
  } else print('git 工作区很干净');
}

/** 未来版本预估 */
async function versionMange(): Promise<boolean | void> {
  const cwd = getDirectoryBy('package.json', 'file');
  if (cwd == undefined) return _p('当前工作目录下或父级不存在 package.json');
  const versionList = await diffPackage();
  // 未获取目标
  if (versionList.length < 2) return versionList.length == 1;
  else if (versionList[0] != versionList[1])
    return _p(
      `当前版本为：${pen.cyan(versionList[0])}\n线上版本为: ${pen.brightRed(
        versionList[1],
      )}\n请保持一致`,
    );
  print(`请选择本次更新版本的类型`);
  const version = versionList[0];
  let a: string | number = 0,
    b: string | number = 0,
    c: string | number = 0,
    d: undefined | string;
  if (versionList[0].includes('-')) [a, d] = version.split('-');
  else a = version;
  [a, b, c] = (a as string).split('.');
  // 转化为数值参与运算
  (a = Number(a)), (b = Number(b)), (c = Number(c));

  const selectVersionType = (await selection([
    `bug  (patch) v${version} -> ${a}.${b}.${d == undefined ? c + 1 : c}`,
    `新内容 (minor) v${version} -> ${a}.${b + 1}.0`,
    `大换代 (major) v${version} -> ${a + 1}.0.0`,
    `测试版本 (prepatch) v${version} -> ${a}.${b}.${c + 1}-0`,
    `内测版本 (preminor) v${version} -> ${a}.${b + 1}.0-0`,
    `公测版本 (premajor) v${version} -> ${a + 1}.0.0-0`,
    `测试迭代 (prerelease) v${version} -> ${a}.${b}.${
      d == undefined ? c + 1 : c
    }-${d == undefined ? 0 : Number(d) + 1}`,
  ])) as string;
  print(greenPen(`请等待整理版本内容`));
  /** 该版本更新并不会提交代码，代码提交放到下面来做版本的变更 */
  const versionUpResult = await runOtherCode(
    `npm version ${selectVersionType.replace(
      /.*\((.*)\).*/,
      '$1',
    )} --no-git-tag-version --force`,
  );
  versionUpResult;
  return true;
}

/** 打印日志 */
function print(str: string) {
  data.log && _p(str);
  return true;
}
