export const PUBLISHER_DATA = [
  {
    name: 'EA',
    siret: 341974749,
    phone: 890219223,
  },
  {
    name: 'Ubisoft',
    siret: 340219241,
    phone: 892648115,
  },
  {
    name: 'Rockstar games',
    siret: 340346271,
    phone: 892347800,
  },
  {
    name: 'Bethesda',
    siret: 482151312,
    phone: 892347800,
  },
];

export const PUBLISHER_FIELDS = [
  { name: 'name', type: 'text' },
  { name: 'siret', type: 'bigint' },
  { name: 'phone', type: 'bigint' },
];

export const GAME_FIELDS = [
  { name: 'title', type: 'text' },
  { name: 'price', type: 'int' },
  { name: 'pulisher', type: 'int', link: 'publisher', key: 'id' },
  { name: 'tags', type: 'text' },
  { name: 'releaseDate', type: 'bigint' },
];
