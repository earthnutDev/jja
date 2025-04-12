import {
  getDirectoryBy,
  pathJoin,
  readFileToJsonSync,
  runOtherCode,
} from 'a-node-tools';

/** 给提交打上 tag  */
export async function tagCommit(commitMessage: string) {
  const cwd = getDirectoryBy('package.json', 'file', process.cwd());
  if (cwd == undefined) return true;
  const version = readFileToJsonSync(pathJoin(cwd, 'package.json')).version;
  if (!version) return true;
  await runOtherCode({
    code: `git tag -a  v${version} -m '${commitMessage}'`,
    cwd,
  });
  await runOtherCode({ code: 'git push origin --tag', cwd });
}
