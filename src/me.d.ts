/**
 * Somewhat egocentric Person type for my own `me.json`,
 * very loosely based on Wikidata.
 * @version 2
 * @author onegen <https://onegen.dev>
 * @see https://onegen.dev/me.d.ts for latest
 *      or https://file.onegen.dev/code/me-2.d.ts for static v2.
 */

/** Education type */
export interface Education {
     /** Common institution identifier (ex. abbr.) */
     id: string;

     /** Name of school in local language */
     nameNative: string;

     /** Name of school in English */
     nameEnglish: string;

     /** Country of institution (ISO 3166 code) */
     country: string;

     /** URL to institution homepage */
     url: string;

     /** Title pursued from education institution in local language */
     titleNative: string;

     /** Title pursued from education institution in English */
     titleEnglish: string;

     /** Start year */
     periodStart: number;

     /** End year (if ongoing, set it to null or a future/current year, null preferred) */
     periodEnd: number | null;

     /** Failed? (if true, periodEnd is expected to be current or past year) */
     failed?: boolean;
}

/** Social network account */
export interface SocialAccount {
     /** Name of social network */
     network: string;

     /** Username on social network */
     username: string;

     /** Link to social network account profile */
     url?: string;

     /** Hidden flag */
     hidden?: boolean;
}

/** Language proficiency */
export interface LanguageLevel {
     /** ISO 639-3 language code */
     code: string;

     /** Language name in English */
     name: string;

     /** Proficiency level (CEFR common reference level + 'native') */
     level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'native';
}

/**
 * Programming language proficiency entry
 * @note Attribs like `orderBadge` and `orderList` are exclusively here for my
 *       GitHub README.md, feel free to omit them.
 */
export interface ProgrammingStackItem {
     /** Name of stack item, usually programming language name */
     name: string;

     /** Proficiency level */
     proficiency: 'junior' | 'intermediate' | 'advanced' | 'guru';

     orderBadge?: number;
     orderList?: number;
}

/** Personal computer data (loosely based on neofetch output) */
export interface PersonalComputer {
     /** Hostname */
     name: string;

     /** Operating system */
     os?: string;
     host?: string;
     kernel?: string;
     shell?: string;

     /** IDE/code editor of choice */
     ide?: string;

     /** CPU (processor) */
     cpu?: string;

     /** GPU (graphics card) */
     gpu?: string;

     /** RAM size (in MiB) */
     ram?: number;

     /** PC environment setup string (arbitrary string) */
     pcEnv?: string;
}

/** Person type, loosely-based on Wikidata 'Human' */
export interface Person {
     /** Person’s username **/
     username: string;

     /** Name in native language */
     name?: string;

     /** Image URL */
     image?: string;

     /** Sex or gender identity */
     gender?: string;

     /** Area of birth */
     hometown?: string;

     /** Country of citizenship */
     country?: string;

     /** Date of birth in format YYYY-MM-DD */
     birthdate?: string;

     /** Languages that a person or a people speaks, writes or signs */
     languages?: Array<LanguageLevel>;

     /** Occupations of a person */
     occupations?: Array<string>; // TODO: this sucks, rethink.

     /** Educations received */
     education?: Array<Education>;

     /** Programming stack record (for categorisation lik "web" or "hardware") */
     stack?: Record<string, Array<ProgrammingStackItem>>;

     /** Personal computer data */
     pc?: PersonalComputer;

     /** Social network account */
     socials?: Array<SocialAccount>;

     /** Last time this file was edited (as a time string) */
     lastEdit: string;

     /** Personal website */
     website?: string;
}
