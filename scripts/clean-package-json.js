import {
  pathJoin,
  readFileToJsonSync,
  getDirectoryBy,
  writeJsonFile,
  runOtherCode,
} from 'a-node-tools';

import { writeFileSync } from 'node:fs';

let packageJson = readFileToJsonSync('./package.json');

['scripts', 'devDependencies', 'lint-staged', 'private'].forEach(
  key => delete packageJson[key],
);
packageJson = {
  ...packageJson,
  author: {
    name: '🥜',
    email: 'earthnut.dev@outlook.com',
    url: 'https://earthnut.dev',
  },
  files: ['bin.js', 'mjs'],
  keywords: ['ixxx', 'jja'],
  repository: {
    type: 'git',
    url: 'git+https://github.com/earthnutDev/jja.git',
  },
  homepage: 'https://earthnut.dev/jja',
  bugs: {
    url: 'https://github.com/earthnutDev/jja/issues',
    email: 'earthnut.dev@outlook.com',
  },
  publishConfig: {
    access: 'public',
    registry: 'https://registry.npmjs.org/',
  },
  bin: {
    jja: 'bin.js',
  },
};

// 写入 dist/package.json
{
  const distPath = getDirectoryBy('dist', 'directory');

  const distPackagePath = pathJoin(distPath, './dist/package.json');

  writeJsonFile(distPackagePath, packageJson);
}

// 写入 dist/bin.js
{
  await runOtherCode({ code: 'mkdir -p ./dist' });
  writeFileSync(
    'dist/bin.js',
    `#!/usr/bin/env node

import './mjs/index.mjs';
  `,
  );
}
