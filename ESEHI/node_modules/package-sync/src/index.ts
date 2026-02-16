import { resolve } from 'path';
import * as utils from './utils';

type PackageSyncOptions = {
  workingDir: string;
  cacheDir: string;
  packageFilePath: string;
  configFilePath: string;
};

type PackageSyncResult = {
  result: 'equal';
} | {
  result: 'diff';
} | {
  result: 'cacheCreated';
} | {
  result: 'installed';
  stderr: string;
  stdout: string;
};

/**
 * Creates, checks package changes, install necessary dependencies and call config hooks
 */
// tslint:disable:export-name
export class PackageSync {

  private get cacheFilePath() {
    const { cacheDir } = this.options;

    return resolve(cacheDir, 'package.json');
  }

  private options: PackageSyncOptions;

  constructor(options: Partial<PackageSyncOptions> = {}) {
    const normalizedOptions = PackageSync.GET_NORMALIZED_OPTIONS(options);

    this.options = normalizedOptions;
  }

  public static GET_NORMALIZED_OPTIONS(options: Partial<PackageSyncOptions>): PackageSyncOptions {
    const workingDir = options.workingDir !== undefined
      ? options.workingDir
      : process.cwd();

    const cacheDir = options.cacheDir !== undefined
      ? options.cacheDir
      : 'node_modules/.cache/package-sync';

    const packageFilePath = options.packageFilePath !== undefined
      ? options.packageFilePath
      : resolve(workingDir, 'package.json');

    const configFilePath = options.packageFilePath !== undefined
      ? options.packageFilePath
      : resolve(workingDir, 'package-sync.config.js');

    return {
      workingDir: resolve(workingDir),
      cacheDir: resolve(cacheDir),
      packageFilePath: resolve(packageFilePath),
      configFilePath: resolve(configFilePath),
    };
  }

  public async updateCache(): Promise<PackageSyncResult> {
    const { cacheFilePath } = this;
    const { cacheDir } = this.options;

    await utils.makeDirDeep(cacheDir);
    const data = await this.getCurrentPackageData();
    await utils.writeFileData(cacheFilePath, data);

    return {
      result: 'cacheCreated',
    };
  }

  public async check(): Promise<PackageSyncResult> {
    const [
      currentPackageData,
      packageCacheData,
    ] = await Promise.all([
      this.getCurrentPackageData(),
      this.getPackageCacheData(),
    ]);

    if (this.isSamePackages(currentPackageData, packageCacheData)) {
      return {
        result: 'equal',
      };
    }

    return this.getPackageDifference(currentPackageData, packageCacheData);
  }

  public async softCheck(): Promise<PackageSyncResult> {
    const { cacheFilePath } = this;

    const exists = await utils.exists(cacheFilePath);

    if (!exists) {
      return this.updateCache();
    }

    return this.check();
  }

  public async installNew(): Promise<PackageSyncResult> {
    const softCheckResult = await this.softCheck();

    if (softCheckResult.result !== 'diff') {
      return softCheckResult;
    }

    const { stdout, stderr } = await utils.execCommand('npm i');

    return {
      result: 'installed',
      stdout,
      stderr,
    };
  }

  private isSamePackages(currentPackageData: string, packageCacheData: string) {
    // @TODO
    return currentPackageData === packageCacheData;
  }

  private getPackageDifference(currentPackageData: string, packageCacheData: string): PackageSyncResult {
    // @TODO
    return {
      result: 'diff',
    };
  }

  private getCurrentPackageData() {
    const { packageFilePath } = this.options;

    return utils.getFileData(packageFilePath);
  }

  private getPackageCacheData() {
    const { cacheFilePath } = this;

    return utils.getFileData(cacheFilePath);
  }
}

//   async updateCache() {
//     const { cacheFilePath } = this.options;

//     await PackageHelpers.makeDirDeep(cacheFilePath);
//     const data = await this.getCurrentPackageData();
//     await this.writePackageCacheData(data);
//   }

//   async check() {
//     const [
//       currentPackageData,
//       packageCacheData,
//     ] = await Promise.all([
//       this.getCurrentPackageData(),
//       this.getPackageCacheData(),
//     ]);

//     if (this.isSamePackages(currentPackageData, packageCacheData)) {
//       return new PackageCheckResult('equal');
//     }

//     return this.getPackageDifference(currentPackageData, packageCacheData);
//   }

//   async softCheck() {
//     const { cacheFilePath } = this;

//     const exists = await PackageHelpers.exists(cacheFilePath);

//     if (!exists) {
//       await this.updateCache();

//       return new PackageCheckResult('updated');
//     }

//     const checkResult = await this.check();

//     return checkResult;
//   }

//   async installNew() {
//     const softCheckResult = await this.softCheck();

//     if (softCheckResult.result !== 'difference') {
//       return softCheckResult;
//     }

//     const { stdout, stderr } = await PackageHelpers.execCommand('npm i');

//     return new PackageCheckResult('installed', {
//       stdout,
//       stderr,
//     });
//   }
// };

// tslint:disable-next-line:no-default-export
export default PackageSync;
