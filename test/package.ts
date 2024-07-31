import test from 'node:test';
import { diffPackage, packageManage } from 'src/package';

test.skip('test package up', async () => {
  //   const name = 'aaa';
  const result = await packageManage({ value: [''], '--upDependencies': [] });
  console.log(result, '112');
});

test('test package diff', async () => {
  const result = await diffPackage(true);
  console.log(result);
});
