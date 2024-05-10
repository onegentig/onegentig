#!/usr/bin/env -S deno run --allow-read --allow-write

/* === Imports === */

import { writeAll } from "https://deno.land/std@0.198.0/streams/write_all.ts";
import { getAdProp, getAdProps } from "./codeblock.js";
import meFile from "../data/me.json" with { type: "json" };

/**
 * @typedef {import('npm:schema-dts').Person} Person
 * @typedef {import('npm:schema-dts').Thing} Thing
 * @typedef {import('npm:schema-dts').PropertyValue} PropertyValue
 */

/* === Utils === */

/* === Main === */

if (import.meta.main) {
     const list = getAdProps(
    /** @type {Person} */(meFile),
          "knowsComputerLanguage",
     ).reduce((acc, item) => {
          const orderRes = getAdProp(item, "badgeOrder");

          if (!orderRes) return acc;

          acc.push({ value: item.value, order: orderRes.value });
          return acc;
     }, []).sort((a, b) => a.order - b.order).map((item) => item.value + ".svg");

     const str = new TextEncoder().encode(list.join("\n"));
     await writeAll(Deno.stdout, str);
     console.error("badgelist: Finished");
}
