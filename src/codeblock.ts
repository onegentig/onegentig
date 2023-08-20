#!/usr/bin/env -S deno run --allow-read --allow-write

/* === Imports === */

import { writeAll } from 'https://deno.land/std@0.198.0/streams/write_all.ts';
import me from '../data/me.json' assert { type: 'json' };

type StackData = Record<
     string,
     Array<{ name: string; badge?: number; overview?: boolean }>
>;

/* === Utilities === */

/**
 * Create a padded string for the tech-stack.
 * @param stack Stack object
 * @returns String
 */
export function createStack(stack: StackData): string {
     const categ = Object.keys(stack);
     const categLen = categ.length;
     const filtStack: StackData = {};
     const categStrArr = Array<string>(categLen);
     let categMaxLen = 0;
     let categTitleMaxLen = 0;

     for (let i = 0; i < categLen; i++) {
          /* Category title */
          categStrArr[i] = `Stack.${titleCase(categ[i])}: `;

          /* Adjust required padding */
          if (categStrArr[i].length > categTitleMaxLen)
               categTitleMaxLen = categStrArr[i].length;

          /* Category filtering */
          filtStack[categ[i]] = stack[categ[i]].filter(
               (lang) => lang.overview !== false
          );

          /* Category length */
          if (filtStack[categ[i]].length > categMaxLen)
               categMaxLen = filtStack[categ[i]].length;
     }

     /* Apply padding */
     for (let i = 0; i < categLen; i++)
          categStrArr[i] = categStrArr[i].padEnd(categTitleMaxLen);

     /* Vertically iterate over languages */
     for (let i = 0; i < categMaxLen; i++) {
          const langStrArr = Array<string>(categLen);
          let langMaxLen = 0;

          /* Add language to array */
          for (let j = 0; j < categLen; j++) {
               const lang = filtStack[categ[j]][i];
               if (!lang) continue;
               langStrArr[j] = `● ${lang.name} `;
               /* Adjust required padding */
               if (langStrArr[j].length > langMaxLen)
                    langMaxLen = langStrArr[j].length;
          }

          for (let j = 0; j < categLen; j++) {
               /* Apply padding */
               if (!langStrArr[j]) continue;
               langStrArr[j] = langStrArr[j].padEnd(langMaxLen);

               /* Add to category string */
               categStrArr[j] += langStrArr[j];
          }
     }

     return categStrArr.join('\n');
}

/**
 * Calculates long-term uptime from a start date
 * in years and months.
 * @param start The start date
 * @param hbLast Date of last heartbeat (optional)
 * @returns The uptime string
 */
export function calculateUptime(start: string, hbLast?: string): string {
     const startDate = new Date(start);
     let endDate = new Date();

     if (hbLast) {
          const hbDate = new Date(hbLast);
          const twoMonthsMs =
               60 /* d */ *
               24 /* h */ *
               60 /* min */ *
               60 /* s */ *
               1000; /* ms */
          if (endDate.getTime() - hbDate.getTime() > twoMonthsMs)
               endDate = hbDate;
     }

     let yr = endDate.getFullYear() - startDate.getFullYear();
     let mo = endDate.getMonth() - startDate.getMonth();

     if (mo < 0) {
          mo += 12;
          yr -= 1;
     }

     let str = `${yr} year${yr > 1 ? 's' : ''}`;
     if (mo > 0) str += `, ${mo} month${mo > 1 ? 's' : ''}`;
     return str;
}

/**
 * Converts string to title case.
 * @see https://www.geeksforgeeks.org/convert-string-to-title-case-in-javascript/
 * @param str String to convert
 * @returns Title Case String
 */
function titleCase(str: string): string {
     const strArr = str.toLowerCase().split(' ');
     for (let i = 0; i < strArr.length; i++) {
          strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
     }

     return strArr.join(' ');
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

/* === Main === */

if (import.meta.main) {
     let profile = `Onegen ~ life version ${lifeVersion()}\n`;
     profile += '-'.repeat(profile.length - 1) + '\n';

     /* Basic info */
     profile += `Name: ${me.name}\n`;
     profile += `Uptime: ${calculateUptime(me.birthday, me.lastCheckIn)}\n`;
     profile += `Kernel: ${me.kernel}\n`;
     profile += `IDE: ${me.ide}\n`;
     profile += `Env: ${me.env}\n\n`;

     /* Tech-Stack */
     profile += createStack(me.stack);

     /* Socials */
     profile += '\n\nSocials: ';
     const socials = Array<string>();
     for (let i = 0; i < me.socials.length; i++) {
          const social = me.socials[i];
          if (social.shown !== true) continue;
          socials.push(`${social.tag} (${social.name})`);
     }
     profile += socials.join(', ');

     /* Export */
     const profileOut = new TextEncoder().encode(profile);
     await writeAll(Deno.stdout, profileOut);
     console.error('codeblock: Finished');
}
