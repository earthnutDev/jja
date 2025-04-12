import { command } from 'src/command';
import { _p, getDirectoryBy, runOtherCode } from 'a-node-tools';
import pen from 'color-pen';
import { print } from './print';
import { greenPen } from 'src/greenPen';
import { diffPackage } from 'src/package/diffPackage';

/** 未来版本预估 */
export async function versionMange(): Promise<boolean | void> {
  const cwd = getDirectoryBy('package.json', 'file');
  if (cwd == undefined) return _p('当前工作目录下或父级不存在 package.json');
  const versionList = await diffPackage();
  // 未获取目标
  if (versionList.length < 2) return versionList.length == 1;
  else if (versionList[0] != versionList[1]) {
    _p(
      `当前版本为：${pen.cyan(versionList[0])}\n线上版本为: ${pen.brightRed(
        versionList[1],
      )}`,
    );

    _p(pen.random('🔥 两个版本号 💡 不一致，请注意 ⚠️'));
  }
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
  a = Number(a);
  b = Number(b);
  c = Number(c);

  const selectVersionType = (await command.selection({
    data: [
      `bug  (patch) ☞ ${a}.${b}.${d == undefined ? c + 1 : c}`,
      `新内容 (minor) ☞ ${a}.${b + 1}.0`,
      `大换代 (major) ☞ ${a + 1}.0.0`,
      `测试版本 (prepatch) ☞ ${a}.${b}.${c + 1}-0`,
      `内测版本 (preminor) ☞ ${a}.${b + 1}.0-0`,
      `公测版本 (premajor) ☞ ${a + 1}.0.0-0`,
      `测试迭代 (prerelease) ☞ ${a}.${b}.${
        d == undefined ? c + 1 : c
      }-${d == undefined ? 0 : Number(d) + 1}`,
    ],
    resultText: '您选择了',
  })) as string;

  print(greenPen(`请等待整理版本内容`));

  const code = `npm version ${selectVersionType.replace(
    /.*\((.*)\).*/,
    '$1',
  )} --no-git-tag-version --force --allow-same-version`;
  /** 该版本更新并不会提交代码，代码提交放到下面来做版本的变更 */
  await runOtherCode({ code, printLog: false });

  return true;
}
