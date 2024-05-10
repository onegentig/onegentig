#!/usr/bin/env -S deno run --allow-read --allow-write

/* === Imports === */

import { writeAll } from "https://deno.land/std@0.198.0/streams/write_all.ts";
import meFile from "../data/me.json" with { type: "json" };

/**
 * @typedef {import('npm:schema-dts').Person} Person
 * @typedef {import('npm:schema-dts').Thing} Thing
 * @typedef {import('npm:schema-dts').PropertyValue} PropertyValue
 */

/* === Utils === */

function lifeVersion () {
     const year = new Date().getFullYear();
     const mile = Math.floor(year / 1000);
     const cent = Math.floor(year / 100) % 10;
     const dec = Math.floor(year / 10) % 10;
     const rem = year % 10;

     return `${mile}.${cent}${dec}.${rem}`;
}

/**
 * Calculates long-term uptime from a start date
 * @param {String} start
 * @param {String | null} hbLast
 * @returns {String}
 */
function calculateUptime (start, hbLast) {
     const startDate = new Date(start);
     let endDate = new Date();

     if (hbLast) {
          const hbDate = new Date(hbLast);
          const twoMonthsMs = 60 /* d */ *
               24 /* h */ *
               60 /* min */ *
               60 /* s */ *
               1000; /* ms */
          if (endDate.getTime() - hbDate.getTime() > twoMonthsMs) {
               endDate = hbDate;
          }
     }

     let yr = endDate.getFullYear() - startDate.getFullYear();
     let mo = endDate.getMonth() - startDate.getMonth();

     if (mo < 0) {
          mo += 12;
          yr -= 1;
     }

     let str = `${yr} year${yr > 1 ? "s" : ""}`;
     if (mo > 0) str += `, ${mo} month${mo > 1 ? "s" : ""}`;
     return str;
}

/**
 * @see https://www.geeksforgeeks.org/convert-string-to-title-case-in-javascript/
 * @param {String} str
 * @returns {String}
 */
function titleCase (str) {
     const strArr = str.toLowerCase().split(" ");
     for (let i = 0; i < strArr.length; i++) {
          strArr[ i ] = strArr[ i ].charAt(0).toUpperCase() + strArr[ i ].slice(1);
     }

     return strArr.join(" ");
}

/**
 * Create a padded tech-stack string from programming language
 * {@link PropertyValue}s
 * @param {Array<PropertyValue>} langs
 * @returns {String}
 */
function createStack (langs) {
     let categTitleMaxLen = 0;
     const categStrs = /** @type {Array<string>} */ ([]);

     const stack = langs.reduce((acc, item) => {
          const categRes = getAdProp(item, "category");
          const orderRes = getAdProp(item, "listOrder");

          // Don’t include lang, if either prop is missing
          if (!categRes) return acc;
          if (!orderRes) return acc;
          const categ = /** @type {String} */ (categRes.value);
          const order = /** @type {Number} */ (orderRes.value);

          // Initialise category, if it doesn’t exist
          if (!acc[ categ ]) {
               acc[ categ ] = [];
               const categTitle = `Stack.${titleCase(categ)}`;
               categStrs.push(categTitle);
               categTitleMaxLen = Math.max(categTitleMaxLen, categTitle.length);
          }

          // Push language to category
          acc[ categ ].push({ value: item.value, order: order });
          return acc;
     }, {});

     // Sort langs and remove order prop
     const stackSorted = /** @type {Record<string, Array<string>>} */ ({});
     for (const categ in stack) {
          stackSorted[ categ ] = stack[ categ ].sort((a, b) => a.order - b.order).map(
               (item) => item.value
          );
     }

     // Pad category names
     for (let i = 0; i < categStrs.length; i++) {
          categStrs[ i ] = `${categStrs[ i ]}:`.padEnd(categTitleMaxLen + 2);
     }

     // Vertically iterate over langs, pad and add
     const categMaxLen = Math.max(
          ...Object.values(stackSorted).map((arr) => arr.length),
     );
     for (let i = 0; i < categMaxLen; i++) {
          const langStrs = /** @type {Array<string>} */ ([]);
          let langMaxLen = 0;

          // First pass: get the languages and max length for padding
          for (const categ in stackSorted) {
               const lang = stackSorted[ categ ][ i ];
               const langStr = lang ? `● ${lang} ` : "";
               langStrs.push(langStr);
               langMaxLen = Math.max(langMaxLen, langStr.length);
          }

          // Second pass: pad the languages and add to categStrs
          for (let j = 0; j < langStrs.length; j++) {
               const lang = langStrs[ j ];
               if (!lang) continue;
               langStrs[ j ] = lang.padEnd(langMaxLen);

               categStrs[ j ] += langStrs[ j ];
          }
     }

     return categStrs.join("\n");
}

/**
 * Gets an additional property from {@link Thing} by name
 * @param {Thing} obj
 * @param {string} name
 * @returns {PropertyValue}
 */
export function getAdProp (obj, name) {
     const adProps = /** @type {Array<PropertyValue>} */ (obj.additionalProperty);
     return adProps.find((prop) => prop.name === name);
}

/**
 * Gets all additional properties from {@link Thing} by name
 * @param {Thing} obj
 * @param {string} name
 * @returns {Array<PropertyValue>}
 */
export function getAdProps (obj, name) {
     const adProps = /** @type {Array<PropertyValue>} */ (obj.additionalProperty);
     return adProps.filter((prop) => prop.name === name);
}

/* === Main === */

if (import.meta.main) {
     const me = /** @type {Person} */ (meFile);
     const pc = /** @type {PropertyValue} */ (getAdProp(me, "hasComputer"));
     let profile = `Onegen ~ life version ${lifeVersion()}\n`;
     profile += "-".repeat(profile.length - 1) + "\n";

     /* Basic info */
     profile += `Name: ${me.givenName} „${me.additionalName}“ ${me.familyName}\n`;
     profile += `Uptime: ${calculateUptime(me.birthDate, getAdProp(me, "lastEdited").value)
          }\n`;
     profile += `Kernel: ${getAdProp(pc, "usesKernel").value}\n`;
     profile += `IDE: ${getAdProp(pc, "primaryDevelopmentProgram").value}\n`;
     profile += `Env: ${getAdProp(pc, "environment").value}\n\n`;

     /* Tech-Stack */
     profile += createStack(getAdProps(me, "knowsComputerLanguage"));

     /* Socials */
     const socNames = /** @type {Array<string>} */ ([]);
     const socObjs = getAdProps(me, "hasOnlinePresence");
     for (const soc of socObjs) {
          if (soc.identifier === "GitHub") continue;
          if (getAdProp(soc, "active").value === false) continue;
          socNames.push(`${soc.value} (${soc.identifier})`);
     }

     if (socNames.length > 0) {
          profile += `\n\nSocials: ${socNames.join(", ")}`;
     }

     const profileOut = new TextEncoder().encode(profile);
     await writeAll(Deno.stdout, profileOut);
     console.error("codeblock: Finished");
}
