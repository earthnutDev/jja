export type packageParam = '--diff' | '--upDependencies';

export type gitParam = 'commit' | 'merge' | 'tag';

export type removeParam = '--ignore' | '--subdirectories';

export type updateParams = '--ignore' | '--dependencies' | '--npm-publish';

export type ArgsArrMapItemList = {
  package: packageParam;
  git: gitParam;
  clearScreen: undefined;
  clearTerminal: undefined;
  remove: removeParam;
  update: updateParams;
};
