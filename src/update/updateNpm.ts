import { pen } from 'color-pen';

import { print } from './print';
import { command } from 'src/command';
import { data } from './data';
import { greenPen } from 'src/greenPen';
import { runOtherCode } from 'a-node-tools';
import { versionMange } from './versionMange';
import { updateDependence } from 'src/package/updateDependence';

/** 升级 npm */
export async function updateNpm() {
  print(pen.hex('#9ff')('开始初始化'));

  //   不自动更新依赖
  const askForUpdateDependence = await command.question({
    text: '是否需要更新依赖？',
    tip: ['跳过', '更新'],
    private: true,
  });
  if (askForUpdateDependence == '更新') {
    await updateDependence(data.log);
  }
  print(greenPen(`依赖更新完毕`));

  print(
    pen.hex('#666')(
      `请等待更新包（你的 package.json 的 scripts 最好有 build 命令）`,
    ),
  );
  const rebuild = await runOtherCode('npm run build');

  if (!rebuild.success) {
    return command.error;
  }
  print(greenPen(`打包测试完成`));
  /** 版本预估 */
  if (!(await versionMange())) return command.error;

  print(greenPen(`版本整理完毕，准备上到 npm`));
  // 整理 git
  if (
    (await command.question({
      text: '是否需要提交代码？',
      tip: ['跳过', '提交'],
    })) === '提交'
  ) {
    await runOtherCode('npm publish');
    print(greenPen(`上推 npm 包完毕`));
  } else {
    print(greenPen(` 🚀 执行 🚀 🥣 🥱`));
  }
}
