export type packageParam = '--diff' | '--upDependencies';

export type githubParam = '--dns' | '--http' | '--ping';

export type gitParam = 'commit' | 'merge' | 'tag';

export type removeParam = '--ignore' | '--subdirectories';

export type updateParams = '--ignore' | '--dependencies' | '--npm-publish';

export type ArgsArrMapItemList = {
  package: packageParam;
  git: gitParam;
  githubIp: githubParam;
  clearScreen: undefined;
  clearTerminal: undefined;
  remove: removeParam;
  update: updateParams;
};
