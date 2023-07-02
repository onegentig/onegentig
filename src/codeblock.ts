#!/usr/bin/env -S deno run --allow-read --allow-write

import { parse } from 'https://deno.land/std@0.192.0/yaml/mod.ts';

/**
 * Calculates long-term uptime from a start date
 * in years and months.
 * @param start The start date
 * @returns The uptime string
 */
function calculateUptime(start: string): string {
     const startDate = new Date(start);
     const now = new Date();

     const yr = now.getFullYear() - startDate.getFullYear();
     const mo = now.getMonth() - startDate.getMonth();

     let str = `${yr} year${yr > 1 ? 's' : ''}`;
     if (mo > 0) str += `, ${mo} month${mo > 1 ? 's' : ''}`;
     return str;
}

/**
 * What is the version of life?
 * @returns The version of life
 */
function lifeVersion(): string {
     const year = new Date().getFullYear();
     const mile = Math.floor(year / 1000);
     const cent = Math.floor(year / 100) % 10;
     const dec = Math.floor(year / 10) % 10;
     const rem = year % 10;

     return `${mile}.${cent}${dec}.${rem}`;
}

/**
 * Create a profile.yaml for a codeblock in the README
 * from the profile.json file.
 * @param data The profile.json data
 * @returns The profile.yaml string
 */
function createProfileYaml(data: any) {
     let yaml = `Onegen ~ life version ${lifeVersion()}\n`;
     yaml += '-'.repeat(yaml.length - 1) + '\n';
     console.error(
          'codeblock: remote fetch not implemented',
     );

     yaml += `Name: ${data.Name}\n`;
     yaml += `Uptime: ${calculateUptime(data.dob as string)}\n`;
     yaml += `Kernel: ${data.Kernel}\n`;
     yaml += `IDE: ${data.IDE}\n`;
     yaml += `Env: ${data.Env}\n\n`;

     for (const [sName, stack] of Object.entries(data.Stack))
          yaml += `Stack.${sName}: ${stack}\n`;

     yaml += `\nSocials: ${data.Socials.join(', ')}`;
     return yaml;
}

/**
 * Get the old profile.yaml file.
 * @returns The old profile.yaml data
 */
function getOld() {
     try {
          const yaml = Deno.readTextFileSync('./data/profile.yaml').split('\n');
          yaml.shift();
          yaml.shift();
          yaml.pop();

          return parse(yaml.join('\n'));
     } catch {
          return undefined;
     }
}

const data = JSON.parse(
     await Deno.readTextFile('./data/profile.json'),
) as Record<string, unknown>;
console.error(
     `codeblock: JSON parsed, found ${Object.keys(data).length} keys`,
);

const yaml = createProfileYaml(data);
const yamlOut = new TextEncoder().encode(yaml);
await Deno.writeFile('./data/profile.yaml', yamlOut);
console.error('codeblock: Finished');
