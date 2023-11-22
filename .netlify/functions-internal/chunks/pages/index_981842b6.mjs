/* empty css                           */import { e as createAstro, f as createComponent, r as renderTemplate, h as addAttribute, i as renderHead, j as renderSlot, k as renderComponent } from '../astro_b1328671.mjs';

const $$Astro$1 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/ai.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/bytedance/Desktop/personal-gpt/src/layouts/Layout.astro", void 0);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "GPT" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Views", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "@/views", "client:component-export": "default" })} ` })} `;
}, "/Users/bytedance/Desktop/personal-gpt/src/pages/index.astro", void 0);

const $$file = "/Users/bytedance/Desktop/personal-gpt/src/pages/index.astro";
const $$url = "";

export { $$Index as default, $$file as file, $$url as url };
