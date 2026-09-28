import {build} from 'esbuild';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const dir=mkdtempSync(join(tmpdir(),'lifelab-tests-'));
try{const file=join(dir,'domain.test.mjs');await build({entryPoints:['tests/domain.test.ts'],bundle:true,platform:'node',format:'esm',outfile:file});const result=spawnSync(process.execPath,['--test',file],{stdio:'inherit'});process.exitCode=result.status??1;}finally{rmSync(dir,{recursive:true,force:true});}
