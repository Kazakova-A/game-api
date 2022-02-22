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

export const GAME_DATA = [
  {
    title: 'GTA 5',
    price: 40,
    tags: '',
    publisher: 3,
    release_date: 1448162798000,
    discount: false,
  },
  {
    title: 'The Elder Scrols',
    price: 20,
    tags: '',
    publisher: 4,
    release_date: 1353554798000,
    discount: false,
  },
  {
    title: 'Assassins Creed Valhalla',
    price: 50,
    tags: '',
    publisher: 2,
    release_date: 1632281198000,
    discount: false,
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
  { name: 'publisher', type: 'int', link: 'publisher', key: 'id' },
  { name: 'tags', type: 'text' },
  { name: 'release_date', type: 'bigint' },
  { name: 'discount', type: 'boolean' },
];
