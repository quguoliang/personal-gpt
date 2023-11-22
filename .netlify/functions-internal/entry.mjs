import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { renderers } from './renderers.mjs';
import { manifest } from './manifest_fbdd2725.mjs';

const _page0  = () => import('./chunks/generic_28d9d0a1.mjs');
const _page1  = () => import('./chunks/index_26fb7e1e.mjs');
const _page2  = () => import('./chunks/index_ac5f32a7.mjs');
const _page3  = () => import('./chunks/completions_5e51c029.mjs');
const _page4  = () => import('./chunks/whisper_141e247c.mjs');
const _page5  = () => import('./chunks/images_84a17d0b.mjs');const pageMap = new Map([["node_modules/.pnpm/astro@3.5.7_@types+node@20.2.5_less@4.1.3_typescript@5.0.4/node_modules/astro/dist/assets/endpoint/generic.js", _page0],["src/pages/index.astro", _page1],["src/pages/api/index.ts", _page2],["src/pages/api/completions.ts", _page3],["src/pages/api/whisper.ts", _page4],["src/pages/api/images.ts", _page5]]);
const _manifest = Object.assign(manifest, {
	pageMap,
	renderers,
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap };
