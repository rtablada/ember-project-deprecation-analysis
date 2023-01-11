/* eslint-disable @typescript-eslint/no-var-requires */
import { Command, Option } from 'commander';
import { writeFile } from 'fs/promises';
import path from 'path';
import { analyseProject } from './index';

const program = new Command();

program
  .name('ember-project-deprecation-analysis')
  .description('A tool for analysing component deprecation')
  .version(require(path.join(__dirname, '../', 'package.json')).version);

program
  .command('analyse')
  .description('Outputs JSON info about pod deprecations, component use, and more!')
  .addOption(
    new Option('--project-path <path>', 'Path to Ember Project')
      .default(process.cwd())
      .env('PROJECT_PATH')
      .makeOptionMandatory()
  )
  .addOption(new Option('--pods-dir <path>', 'Directory for pod root').env('PODS_DIR').makeOptionMandatory())
  .addOption(new Option('-o, --output <path>', 'Directory for pod root').makeOptionMandatory())
  .action(async (options) => {
    const result = await analyseProject(options.projectPath, options.podsDir);

    await writeFile(options.output, JSON.stringify(result, null, 2), { encoding: 'utf-8' });
  });

program.parse();
