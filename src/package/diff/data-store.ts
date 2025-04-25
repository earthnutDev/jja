import { npmPkgInfoType, PackageJson } from 'a-node-tools';
import { isUndefined } from 'a-type-of-js';

/**
 *
 * diff 数仓
 *
 */
export const diffData: {
  /**  本地 package.json 数据  */
  local: PackageJson | null;
  /**  pkg npm 线上数据  */
  online: npmPkgInfoType | null;
  /**  依赖信息  */
  dependencies: {
    [x: string]: {
      type: 'dependencies' | 'devDependencies';
      /**  package.json 中指定的版本  */
      version: string;
      /**
       * 最后发布的版本，非最后的 latest 版本
       *
       * 且仅在最后发布的版本不是 latest 版本时才有值
       */
      latestVersion: string;
      /**  本地安装版本  */
      localVersion: string;
      /**  线上最后一个 latest 版本  */
      onlineVersion: string;
      // 安装的标签
      tag: string;
    };
  };
  /**  可更新依赖  */
  updateDependence: string[];
  /**  最后版本不在安全更新范围的依赖  */
  latestDependence: string[];
  /**  有最新的预发布版本  */
  preReleaseDependence: string[];
  /**  数据装箱  */
  binning: (list: { [x: string]: string } | undefined, isDev?: boolean) => void;
} = {
  local: null,
  online: null,
  dependencies: {},
  updateDependence: [],
  latestDependence: [],
  binning: function (list, isDev = false): void {
    /// 空直接返回
    if (isUndefined(list)) return;

    /// 循环遍历
    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        const element = list[key];
        this.dependencies[key] = {
          type: isDev ? 'devDependencies' : 'dependencies',
          version: element,
          localVersion: '',
          latestVersion: '',
          onlineVersion: '',
          tag: '',
        };
      }
    }
  },
  preReleaseDependence: [],
};
