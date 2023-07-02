#!/usr/bin/env -S deno run --allow-read

/**
 * Onegen's README.md generator
 * @file README.ts
 * @date 2023-07-01
 */

import { writeAllSync } from 'https://deno.land/std@0.192.0/streams/write_all.ts';
import {
     ExportFormat,
     HeadingStyle,
     KramdownBuilder,
} from '../../../private/kramdown-deno/mod.ts';
// } from 'https://raw.githubusercontent.com/nickonegen/kramdown-deno/v0.0.3/mod.ts';

/** The document builder */
const builder = new KramdownBuilder({
     headings: HeadingStyle.SETEX_ATX_CLOSED,
}).addComment('Generated from README.ts by kramdown-deno');

/* === Register references === */

const imageRefs = JSON.parse(
     await Deno.readTextFile('./data/images.json'),
) as Array<{
     id: string;
     url: string;
     alt?: string;
     options?: Record<string, string>;
}>;

const linkRefs = JSON.parse(
     await Deno.readTextFile('./data/links.json'),
) as Array<{
     id: string;
     url: string;
     title?: string;
}>;

for (const ref of imageRefs)
     builder.registerRefImage(ref.id, ref.url, ref.alt, ref.options);
for (const ref of linkRefs) builder.registerRefLink(ref.id, ref.url, ref.title);
console.error(
     `builder: Registered ${imageRefs.length} images and ${linkRefs.length} links`,
);

/* === Top section === */

const introBldr = builder
     .createChild()
     .addRefImageLinkRef('profile-banner', 'profile-link')
     .addRefImageLinkRef('profile-title', 'profile-link')
     .addParagraph(par =>
          par
               .addText('Hey-o, I’m')
               .addText('Nick').bold()
               .addText('Onegen').bold().em()
               .addText(', a dude who likes computers')
               .addText('and other such things! ^^'),
     )
     .addParagraph(par =>
          par
               .addRefImageLinkRef('badge-editor-vscode', 'vscode')
               .addRefImageLinkRef('badge-editor-nvim', 'nvim')
               .addRefImageLinkRef('badge-editor-vs', 'vs')
               .addRefImageLinkRef('badge-editor-arduino', 'arduino')
               .br()
               .addRefImageLinkRef('badge-os-fedora', 'fedora')
               .addRefImageLinkRef('badge-os-endeavouros', 'endeavouros')
               .addRefImageLinkRef('badge-os-windows', 'windows'),
     )
     .addRefImage('badge-languages');

console.error(
     `builder: Intro section complete with ${introBldr.nodeCount()} nodes.`,
);
builder.addDiv(introBldr, { align: 'center' }).addRefImage('divider');

/* === Proficiencies section === */

builder.addRefImage('education');

console.error('builder: Fetching profile.yaml');
const codeblock = Deno.readTextFileSync('./data/profile.yaml');

const codeBldr = builder.createChild().addCode(codeblock, 'yaml');

console.error(
     `builder: Proficiencies section complete with ${codeBldr.nodeCount()} nodes`,
);
builder.addDiv(codeBldr, { align: 'left', width: '70%' });

writeAllSync(Deno.stdout, builder.build(ExportFormat.GFM));
console.error(
     `builder: Finished! Builder had ${builder.nodeCount()} top-level nodes`,
);
