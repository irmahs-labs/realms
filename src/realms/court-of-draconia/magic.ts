import type { Language } from "../../lib/language";
import type { Affinity, Element, Role, Tier } from "./rules";

/** A line in each of the site's languages. */
export type Words = Readonly<Record<Language, string>>;

const w = (en: string, fr: string): Words => ({ en, fr });

/**
 * The Elemental Magic System: the world of the Court of Draconia. Every
 * colour is fixed, as artwork: the element takes most of a draconoid's
 * emblem, the affinity its accents, the tier only the trim.
 */

export interface ElementInfo {
  name: Words;
  /** The form every draconoid of the element can use. */
  base: Words;
  /** Its colour on an emblem. */
  colour: string;
  /** The season of the Court member who wields it. */
  season: Words;
}

export const ELEMENT_INFO: Readonly<Record<Element, ElementInfo>> = {
  air: {
    base: w("Wind", "Vent"),
    colour: "#e0a72c",
    name: w("Air", "Air"),
    season: w("autumn", "automne"),
  },
  earth: {
    base: w("Ground", "Sol"),
    colour: "#4b7d2a",
    name: w("Earth", "Terre"),
    season: w("spring", "printemps"),
  },
  fire: {
    base: w("Flame", "Flamme"),
    colour: "#b5372f",
    name: w("Fire", "Feu"),
    season: w("summer", "été"),
  },
  water: {
    base: w("Wave", "Vague"),
    colour: "#2f68b3",
    name: w("Water", "Eau"),
    season: w("winter", "hiver"),
  },
};

export interface AffinityInfo {
  name: Words;
  /** How it goes after an element: "dark fire", "feu d'ombre". */
  of: Words;
  /** What it leans toward. */
  about: Words;
  colour: string;
}

export const AFFINITY_INFO: Readonly<Record<Affinity, AffinityInfo>> = {
  dark: {
    about: w(
      "Moves inward: depth, density, what is hidden. Not evil, just an affinity.",
      "Va vers l’intérieur : la profondeur, la densité, ce qui est caché. Pas le mal, juste une affinité."
    ),
    colour: "#16130f",
    name: w("Dark", "Ombre"),
    of: w("dark", "d’ombre"),
  },
  light: {
    about: w(
      "Moves outward: growth, release, radiance. Not good, just an affinity.",
      "Va vers l’extérieur : la croissance, la libération, le rayonnement. Pas le bien, juste une affinité."
    ),
    colour: "#fffaf0",
    name: w("Light", "Lumière"),
    of: w("light", "de lumière"),
  },
};

export interface TierInfo {
  name: Words;
  /** Its trim on an emblem; multichrome shifts through every colour. */
  colour: string;
}

export const TIER_INFO: Readonly<Record<Tier, TierInfo>> = {
  bronze: { colour: "#a8682e", name: w("Bronze", "Bronze") },
  gold: { colour: "#d6ae36", name: w("Gold", "Or") },
  multichrome: { colour: "#9b7fd4", name: w("Multichrome", "Multichrome") },
  silver: { colour: "#b8bcc6", name: w("Silver", "Argent") },
};

/** A light power and its mirrored dark one. */
export interface Mirror {
  light: Words;
  dark: Words;
  /** What sets them apart: "life growing vs life decaying". */
  mirror: Words;
}

const m = (light: Words, dark: Words, mirror: Words): Mirror => ({
  dark,
  light,
  mirror,
});

/** Each element's three specializations, light and dark. */
export const POWERS: Readonly<Record<Element, readonly Mirror[]>> = {
  air: [
    m(
      w("Gravity", "Gravité"),
      w("Void", "Vide"),
      w("weight vs emptiness", "le poids contre le vide")
    ),
    m(
      w("Smoke", "Fumée"),
      w("Cyclone", "Cyclone"),
      w(
        "drifting outward vs spinning inward",
        "dériver vers l’extérieur contre tourner vers l’intérieur"
      )
    ),
    m(
      w("Sound", "Son"),
      w("Thunder", "Tonnerre"),
      w(
        "controlled vibration vs raw shockwave",
        "la vibration maîtrisée contre l’onde de choc brute"
      )
    ),
  ],
  earth: [
    m(
      w("Plant", "Plante"),
      w("Poison", "Poison"),
      w(
        "life growing vs life decaying",
        "la vie qui pousse contre la vie qui se décompose"
      )
    ),
    m(
      w("Crystal", "Cristal"),
      w("Metal", "Métal"),
      w(
        "clear mineral vs dense ore",
        "le minéral clair contre le minerai dense"
      )
    ),
    m(
      w("Sand", "Sable"),
      w("Fossil", "Fossile"),
      w(
        "loose surface grains vs what hardens deep below",
        "les grains libres en surface contre ce qui durcit en profondeur"
      )
    ),
  ],
  fire: [
    m(
      w("Plasma", "Plasma"),
      w("Magma", "Magma"),
      w(
        "glowing superheated matter vs molten rock",
        "la matière surchauffée et lumineuse contre la roche en fusion"
      )
    ),
    m(
      w("Heat", "Chaleur"),
      w("Combustion", "Combustion"),
      w(
        "temperature without flame vs flame consuming fuel",
        "la température sans flamme contre la flamme qui dévore son combustible"
      )
    ),
    m(
      w("Lightning", "Foudre"),
      w("Laser", "Laser"),
      w(
        "wild branching energy vs one focused beam",
        "l’énergie sauvage qui se ramifie contre un seul rayon concentré"
      )
    ),
  ],
  water: [
    m(
      w("Snow", "Neige"),
      w("Ice", "Glace"),
      w(
        "soft and falling vs hard and frozen solid",
        "douce et qui tombe contre dure et gelée"
      )
    ),
    m(
      w("Bubbles", "Bulles"),
      w("Blood", "Sang"),
      w(
        "air inside water vs water inside a body",
        "l’air dans l’eau contre l’eau dans un corps"
      )
    ),
    m(
      w("Mist", "Brume"),
      w("Mire", "Fange"),
      w(
        "light vapor rising vs heavy mud sinking",
        "la vapeur légère qui monte contre la boue lourde qui s’enfonce"
      )
    ),
  ],
};

export interface RoleInfo {
  /** French names are ones that fit anyone, whatever their gender. */
  name: Words;
  focus: Words;
  skills: readonly Words[];
}

/** Basic magic: raw manipulation of magic itself, the same for every element and affinity. */
export const ROLE_INFO: Readonly<Record<Role, RoleInfo>> = {
  artificer: {
    focus: w("Crafting", "Création"),
    name: w("Artificer", "Alchimiste"),
    skills: [
      w("Enchantment (of objects)", "Enchantement (des objets)"),
      w("Runes", "Runes"),
      w("Potions", "Potions"),
    ],
  },
  guardian: {
    focus: w("Body", "Corps"),
    name: w("Guardian", "Sentinelle"),
    skills: [
      w("Enhancement", "Renforcement"),
      w("Protection", "Protection"),
      w("Healing", "Guérison"),
    ],
  },
  illusionist: {
    focus: w("Deception", "Tromperie"),
    name: w("Illusionist", "Illusionniste"),
    skills: [
      w("Illusion", "Illusion"),
      w("Invisibility", "Invisibilité"),
      w("Shapeshifting", "Métamorphose"),
    ],
  },
  seer: {
    focus: w("Insight", "Clairvoyance"),
    name: w("Seer", "Oracle"),
    skills: [
      w("Divination", "Divination"),
      w("Telepathy", "Télépathie"),
      w("Detection", "Détection"),
    ],
  },
  summoner: {
    focus: w("Calling", "Appel"),
    name: w("Summoner", "Mage d’invocation"),
    skills: [
      w(
        "Summoning (pixies, spirits, the undead)",
        "Invocation (pixies, esprits, morts-vivants)"
      ),
      w("Familiars", "Familiers"),
      w("Conjuration", "Conjuration"),
    ],
  },
  wayfarer: {
    focus: w("Movement", "Mouvement"),
    name: w("Wayfarer", "Nomade"),
    skills: [
      w("Teleportation", "Téléportation"),
      w("Flying (yourself)", "Vol (soi-même)"),
      w("Levitation (objects and others)", "Lévitation (objets et autres)"),
    ],
  },
};

/** How far a role's skills reach at each tier: a bronze wayfarer blinks a few metres, a multichrome one crosses the world. */
export const TIER_REACH: Readonly<Record<Tier, Words>> = {
  bronze: w(
    "A first spark: skills reach a few metres and last moments.",
    "Une première étincelle : les sorts portent à quelques mètres et durent un instant."
  ),
  gold: w(
    "Mastery: skills reach across a land.",
    "La maîtrise : les sorts portent à travers tout un pays."
  ),
  multichrome: w(
    "The summit: skills reach across the world.",
    "Le sommet : les sorts portent à travers le monde."
  ),
  silver: w(
    "Practised: skills reach across a town.",
    "L’habitude : les sorts portent à travers une ville."
  ),
};

export interface Ultimate {
  name: Words;
  effect: Words;
}

const u = (name: Words, effect: Words): Ultimate => ({ effect, name });

/**
 * The duo ultimates: a light draconoid and a dark one together unleash a
 * natural catastrophe, by the light one's element (first key) and the dark
 * one's (second).
 */
export const ULTIMATES: Readonly<
  Record<Element, Readonly<Record<Element, Ultimate>>>
> = {
  air: {
    air: u(
      w("Tornado", "Tornade"),
      w(
        "Gravity and wind meet cyclone and void in a towering funnel.",
        "La gravité et le vent rencontrent le cyclone et le vide en un entonnoir gigantesque."
      )
    ),
    earth: u(
      w("Plague", "Peste"),
      w(
        "Wind and smoke carry poison across the land.",
        "Le vent et la fumée portent le poison à travers le pays."
      )
    ),
    fire: u(
      w("Firestorm", "Tempête de feu"),
      w(
        "Wind and smoke feed combustion into a raging whirl of flame.",
        "Le vent et la fumée nourrissent la combustion en un tourbillon de flammes déchaîné."
      )
    ),
    water: u(
      w("Monsoon", "Mousson"),
      w(
        "Wind brings endless torrents of dark rain.",
        "Le vent apporte des torrents sans fin de pluie sombre."
      )
    ),
  },
  earth: {
    air: u(
      w("Sandstorm", "Tempête de sable"),
      w(
        "Cyclones whip sand into a blinding wall.",
        "Les cyclones fouettent le sable en un mur aveuglant."
      )
    ),
    earth: u(
      w("Earthquake", "Séisme"),
      w(
        "The ground splits and heaves; crystal and roots rise while metal and fossil crush below.",
        "Le sol se fend et se soulève ; le cristal et les racines montent pendant que le métal et le fossile écrasent tout en dessous."
      )
    ),
    fire: u(
      w("Volcano", "Volcan"),
      w(
        "Magma and combustion erupt through the land.",
        "Le magma et la combustion jaillissent à travers la terre."
      )
    ),
    water: u(
      w("Mudslide", "Coulée de boue"),
      w(
        "Mire turns sand and soil into a crushing flow of mud.",
        "La fange change le sable et la terre en une coulée de boue écrasante."
      )
    ),
  },
  fire: {
    air: u(
      w("Thunderstorm", "Orage"),
      w(
        "Lightning meets thunder, and the sky explodes.",
        "La foudre rencontre le tonnerre, et le ciel explose."
      )
    ),
    earth: u(
      w("Meteor", "Météore"),
      w(
        "Blazing plasma wrapped around metal falling from the sky.",
        "Du plasma ardent enveloppe le métal qui tombe du ciel."
      )
    ),
    fire: u(
      w("Wildfire", "Feu de forêt"),
      w(
        "An unstoppable blaze: lightning and heat ignite it, combustion and magma spread it.",
        "Un brasier que rien n’arrête : la foudre et la chaleur l’allument, la combustion et le magma le propagent."
      )
    ),
    water: u(
      w("Drought", "Sécheresse"),
      w(
        "Heat dries out mire and blood, leaving nothing behind.",
        "La chaleur assèche la fange et le sang, et ne laisse rien derrière elle."
      )
    ),
  },
  water: {
    air: u(
      w("Snowstorm", "Tempête de neige"),
      w(
        "Snow and mist driven by cyclones and thunder.",
        "La neige et la brume poussées par les cyclones et le tonnerre."
      )
    ),
    earth: u(
      w("Sinkhole", "Gouffre"),
      w(
        "Water eats away the deep ground until it collapses.",
        "L’eau ronge le sol profond jusqu’à ce qu’il s’effondre."
      )
    ),
    fire: u(
      w("Geyser", "Geyser"),
      w(
        "Snow and bubbles hit magma and explode into boiling steam.",
        "La neige et les bulles frappent le magma et explosent en vapeur bouillante."
      )
    ),
    water: u(
      w("Hurricane", "Ouragan"),
      w(
        "A massive water storm: waves, snow and mist driven against ice and mire.",
        "Une immense tempête d’eau : vagues, neige et brume lancées contre la glace et la fange."
      )
    ),
  },
};

export interface CourtMember {
  id: string;
  name: string;
  title: Words;
  /** Spring to winter for the four rulers; none for the queen and king. */
  season: Words | null;
  species: Words;
  creature: Words;
  /** The element they wield; the queen and king wield light and dark themselves. */
  wields: Element | Affinity;
  origin: Words;
  nameMeaning: Words;
  titleMeaning: Words | null;
}

/**
 * The six original elemental wielders: a light queen and a dark king, and a
 * dragon ruler for each season, each holding a title from their own region.
 */
export const COURT: readonly CourtMember[] = [
  {
    creature: w("Faerie dragon", "Dragon féerique"),
    id: "ljosa",
    name: "Ljósa",
    nameMeaning: w(
      "From Old Norse ljós, light, the same root as the light elves (Ljósálfar).",
      "Du vieux norrois ljós, la lumière, la même racine que les elfes de lumière (Ljósálfar)."
    ),
    origin: w("Northern Europe", "Europe du Nord"),
    season: null,
    species: w("Fae", "Fée"),
    title: w("Queen", "Reine"),
    titleMeaning: null,
    wields: "light",
  },
  {
    creature: w("Dragon", "Dragon"),
    id: "tenebrus",
    name: "Tenebrus",
    nameMeaning: w(
      "From Latin tenebrae, darkness.",
      "Du latin tenebrae, les ténèbres."
    ),
    origin: w("Western Europe", "Europe de l’Ouest"),
    season: null,
    species: w("Draco", "Draco"),
    title: w("King", "Roi"),
    titleMeaning: null,
    wields: "dark",
  },
  {
    creature: w("Drake", "Drake"),
    id: "chunlin",
    name: "Chunlin",
    nameMeaning: w(
      "Chinese chūn, spring, and lín, from qilin.",
      "Du chinois chūn, le printemps, et lín, de qilin."
    ),
    origin: w("East Asia", "Asie de l’Est"),
    season: w("Spring", "Printemps"),
    species: w("Qilin", "Qilin"),
    title: w("Gongzhu", "Gongzhu"),
    titleMeaning: w(
      "Chinese for princess, a royal daughter.",
      "« Princesse » en chinois, une fille royale."
    ),
    wields: "earth",
  },
  {
    creature: w("Wyvern", "Vouivre"),
    id: "zarko",
    name: "Žarko",
    nameMeaning: w(
      "A South Slavic name from žar, heat or embers, the same root as the Firebird (Zhar-ptitsa).",
      "Un prénom slave du Sud, de žar, la chaleur ou les braises, la même racine que l’Oiseau de feu (Jar-ptitsa)."
    ),
    origin: w("Eastern Europe", "Europe de l’Est"),
    season: w("Summer", "Été"),
    species: w("Zilant", "Zilant"),
    title: w("Voivode", "Voïvode"),
    titleMeaning: w(
      "A Slavic title for a warlord or a governor ruling a province.",
      "Un titre slave pour un chef de guerre ou le gouverneur d’une province."
    ),
    wields: "fire",
  },
  {
    creature: w("Amphiptere", "Amphiptère"),
    id: "ehecatl",
    name: "Ehecatl",
    nameMeaning: w(
      "Nahuatl for wind, the wind god form of Quetzalcoatl.",
      "« Vent » en nahuatl, la forme de dieu du vent de Quetzalcoatl."
    ),
    origin: w("Mesoamerica", "Mésoamérique"),
    season: w("Autumn", "Automne"),
    species: w("Quetzalcoatl", "Quetzalcoatl"),
    title: w("Tlatoani", "Tlatoani"),
    titleMeaning: w(
      "Nahuatl for ruler, literally the one who speaks.",
      "« Souverain » en nahuatl, littéralement celui qui parle."
    ),
    wields: "air",
  },
  {
    creature: w("Sea serpent", "Serpent de mer"),
    id: "himani",
    name: "Himani",
    nameMeaning: w(
      "Sanskrit for snow or glacier, from hima, the same root as Himalaya.",
      "« Neige » ou « glacier » en sanskrit, de hima, la même racine que l’Himalaya."
    ),
    origin: w("South and Southeast Asia", "Asie du Sud et du Sud-Est"),
    season: w("Winter", "Hiver"),
    species: w("Naga", "Naga"),
    title: w("Rajkumari", "Rajkumari"),
    titleMeaning: w(
      "Sanskrit and Hindi for princess, literally the king’s daughter.",
      "« Princesse » en sanskrit et en hindi, littéralement la fille du roi."
    ),
    wields: "water",
  },
];

/** "Dark fire", "feu d'ombre": an element as its affinity bends it. */
export const bentElement = (
  element: Element,
  affinity: Affinity,
  language: Language
): string => {
  const name = ELEMENT_INFO[element].name[language];
  const of = AFFINITY_INFO[affinity].of[language];

  return language === "fr"
    ? `${name} ${of}`
    : `${of.charAt(0).toUpperCase()}${of.slice(1)} ${name.toLowerCase()}`;
};
