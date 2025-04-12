import { runOtherCode } from 'a-node-tools';
import { command } from 'src/command';

/** 合并两个分支  */
export async function gitMerge(params: string) {
  if (params == '') {
    const branchList = await runOtherCode('git branch -a');
    console.log(branchList.data);
    params = await command.question({
      text: '请输入要合并分支的名称',
      private: true,
    });
  }
  const mergeType: number = (await command.selection(
    {
      data: [
        '正常快进合并',
        '非快进合并 （--no-ff）',
        '多提交记录合并为一条 （--squash）',
      ],
      private: true,
    },
    'number',
  )) as number;
  await runOtherCode(
    `git merge ${params}  ${['', '--no-ff', '--squash'][mergeType]}`,
  );
}
