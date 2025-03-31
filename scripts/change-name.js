import { pathJoin, readFileToJsonSync } from 'a-node-tools';
import { writeFileSync } from 'node:fs';

const packageJson = readFileToJsonSync('./dist/package.json');

/**  原来的名称  */
const on = packageJson.name;
/**  新包的名称  */
const nn = 'ixxx';
packageJson.name = nn;
packageJson.bin = Object.fromEntries([[nn, packageJson.bin[on]]]);
delete packageJson.scripts;
delete packageJson.devDependencies;
delete packageJson['lint-staged'];
delete packageJson.private;

// eslint-disable-next-line no-undef
const distPath = pathJoin(process.cwd(), './dist/package.json');

writeFileSync(distPath, JSON.stringify(packageJson, null, 2));
