// Generates supabase/seed.sql from the real menu in src/utils/mockData.js.
// Run: node scripts/gen_seed.mjs
import { mockCategories, mockMenuItems, mockCafeDetails } from '../src/utils/mockData.js';
import { writeFileSync } from 'node:fs';

// Pick an icon (from the admin's AVAILABLE_ICONS set) for each category.
const ICONS = {
  'Coffee': 'Coffee',
  'Tea': 'Leaf',
  'Hot Chocolate': 'Milk',
  'Soft drinks': 'CupSoda',
  'Freshly made': 'Citrus',
  'Beer': 'Beer',
  'Wine': 'Wine',
  'Spirits': 'Martini',
  'Shots': 'FlaskConical',
  'Long drinks': 'GlassWater',
  'Snacks': 'Cookie',
};

const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);

const nameToId = new Map(mockCategories.map((c) => [c.name, c.id]));

let sql = `-- Seed: real "The Old Place" menu, generated from src/utils/mockData.js.\n`;
sql += `-- Idempotent: clears the three content tables first, then re-inserts.\n\n`;
sql += `truncate table public."menuItems" restart identity cascade;\n`;
sql += `truncate table public.categories restart identity cascade;\n`;
sql += `delete from public."cafeDetails";\n\n`;

// Categories (explicit ids to match menu item references)
sql += `insert into public.categories (id, name, icon) values\n`;
sql += mockCategories
  .map((c) => `  (${c.id}, ${q(c.name)}, ${q(ICONS[c.name] || 'Utensils')})`)
  .join(',\n') + ';\n';
sql += `select setval(pg_get_serial_sequence('public.categories','id'), (select max(id) from public.categories));\n\n`;

// Menu items
sql += `insert into public."menuItems" (name, category_id, price, description, subcategory) values\n`;
sql += mockMenuItems
  .map((i) => {
    const catId = nameToId.get(i.category);
    const desc = i.description ? i.description : null;
    return `  (${q(i.name)}, ${catId}, ${q(i.price)}, ${q(desc)}, ${q(i.subcategory)})`;
  })
  .join(',\n') + ';\n\n';

// Cafe details (single row)
const d = mockCafeDetails;
sql += `insert into public."cafeDetails" (id, name, "logoUrl", address, phone, slogan, hours) values\n`;
sql += `  (1, ${q(d.name)}, ${q(d.logoUrl)}, ${q(d.address)}, ${q(d.phone)}, ${q(d.slogan)}, ${q(JSON.stringify(d.hours))}::jsonb);\n`;
sql += `select setval(pg_get_serial_sequence('public."cafeDetails"','id'), 1);\n`;

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql);
console.log(`Wrote supabase/seed.sql: ${mockCategories.length} categories, ${mockMenuItems.length} items, 1 cafe row.`);
