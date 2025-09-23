/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console */
import columns1Parser from './parsers/columns1.js';
import columns4Parser from './parsers/columns4.js';
import columns8Parser from './parsers/columns8.js';
import columns3Parser from './parsers/columns3.js';
import columns5Parser from './parsers/columns5.js';
import hero6Parser from './parsers/hero6.js';
import columns9Parser from './parsers/columns9.js';
import cards10Parser from './parsers/cards10.js';
import columns11Parser from './parsers/columns11.js';
import columns15Parser from './parsers/columns15.js';
import cards12Parser from './parsers/cards12.js';
import columns18Parser from './parsers/columns18.js';
import cards19Parser from './parsers/cards19.js';
import hero20Parser from './parsers/hero20.js';
import columns16Parser from './parsers/columns16.js';
import cards2Parser from './parsers/cards2.js';
import columns21Parser from './parsers/columns21.js';
import cards7Parser from './parsers/cards7.js';
import tabs22Parser from './parsers/tabs22.js';
import columns28Parser from './parsers/columns28.js';
import columns27Parser from './parsers/columns27.js';
import hero29Parser from './parsers/hero29.js';
import carousel24Parser from './parsers/carousel24.js';
import columns30Parser from './parsers/columns30.js';
import hero13Parser from './parsers/hero13.js';
import columns32Parser from './parsers/columns32.js';
import columns31Parser from './parsers/columns31.js';
import columns33Parser from './parsers/columns33.js';
import hero25Parser from './parsers/hero25.js';
import accordion17Parser from './parsers/accordion17.js';
import cards34Parser from './parsers/cards34.js';
import columns40Parser from './parsers/columns40.js';
import cards23Parser from './parsers/cards23.js';
import columns39Parser from './parsers/columns39.js';
import hero41Parser from './parsers/hero41.js';
import cards26Parser from './parsers/cards26.js';
import columns37Parser from './parsers/columns37.js';
import hero38Parser from './parsers/hero38.js';
import cards36Parser from './parsers/cards36.js';
import cards35Parser from './parsers/cards35.js';
import headerParser from './parsers/header.js';
import metadataParser from './parsers/metadata.js';
import cleanupTransformer from './transformers/cleanup.js';
import imageTransformer from './transformers/images.js';
import linkTransformer from './transformers/links.js';
import sectionsTransformer from './transformers/sections.js';
import { TransformHook } from './transformers/transform.js';
import { customParsers, customTransformers, customElements } from './import.custom.js';
import {
  generateDocumentPath,
  handleOnLoad,
  mergeInventory,
} from './import.utils.js';

const parsers = {
  metadata: metadataParser,
  columns1: columns1Parser,
  columns4: columns4Parser,
  columns8: columns8Parser,
  columns3: columns3Parser,
  columns5: columns5Parser,
  hero6: hero6Parser,
  columns9: columns9Parser,
  cards10: cards10Parser,
  columns11: columns11Parser,
  columns15: columns15Parser,
  cards12: cards12Parser,
  columns18: columns18Parser,
  cards19: cards19Parser,
  hero20: hero20Parser,
  columns16: columns16Parser,
  cards2: cards2Parser,
  columns21: columns21Parser,
  cards7: cards7Parser,
  tabs22: tabs22Parser,
  columns28: columns28Parser,
  columns27: columns27Parser,
  hero29: hero29Parser,
  carousel24: carousel24Parser,
  columns30: columns30Parser,
  hero13: hero13Parser,
  columns32: columns32Parser,
  columns31: columns31Parser,
  columns33: columns33Parser,
  hero25: hero25Parser,
  accordion17: accordion17Parser,
  cards34: cards34Parser,
  columns40: columns40Parser,
  cards23: cards23Parser,
  columns39: columns39Parser,
  hero41: hero41Parser,
  cards26: cards26Parser,
  columns37: columns37Parser,
  hero38: hero38Parser,
  cards36: cards36Parser,
  cards35: cards35Parser,
  ...customParsers,
};

const transformers = [
  cleanupTransformer,
  imageTransformer,
  linkTransformer,
  sectionsTransformer,
  ...(Array.isArray(customTransformers)
    ? customTransformers
    : Object.values(customTransformers)),
];

// Additional page elements to parse that are not included in the inventory
const pageElements = [{ name: 'metadata' }, ...customElements];

WebImporter.Import = {
  findSiteUrl: (instance, siteUrls) => (
    siteUrls.find(({ id }) => id === instance.urlHash)
  ),
  transform: (hookName, element, payload) => {
    // perform any additional transformations to the page
    transformers.forEach((transformerFn) => (
      transformerFn.call(this, hookName, element, payload)
    ));
  },
  getParserName: ({ name, key }) => key || name,
  getElementByXPath: (document, xpath) => {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue;
  },
  getFragmentXPaths: (
    { urls = [], fragments = [] },
    sourceUrl = '',
  ) => (fragments.flatMap(({ instances = [] }) => instances)
    .filter((instance) => {
      // find url in urls array
      const siteUrl = WebImporter.Import.findSiteUrl(instance, urls);
      if (!siteUrl) {
        return false;
      }
      return siteUrl.url === sourceUrl;
    })
    .map(({ xpath }) => xpath)),
};

/**
* Page transformation function
*/
function transformPage(main, { inventory, ...source }) {
  const { urls = [], blocks: inventoryBlocks = [] } = inventory;
  const { document, params: { originalURL } } = source;

  // get fragment elements from the current page
  const fragmentElements = WebImporter.Import.getFragmentXPaths(inventory, originalURL)
    .map((xpath) => WebImporter.Import.getElementByXPath(document, xpath))
    .filter((el) => el);

  // get dom elements for each block on the current page
  const blockElements = inventoryBlocks
    .flatMap((block) => block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .map((instance) => ({
        ...block,
        uuid: instance.uuid,
        section: instance.section,
        element: WebImporter.Import.getElementByXPath(document, instance.xpath),
      })))
    .filter((block) => block.element);

  const defaultContentElements = inventory.outliers
    .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
    .map((instance) => ({
      ...instance,
      element: WebImporter.Import.getElementByXPath(document, instance.xpath),
    }))
    .filter((block) => block.element);

  // remove fragment elements from the current page
  fragmentElements.forEach((element) => {
    if (element) {
      element.remove();
    }
  });

  // before page transform hook
  WebImporter.Import.transform(TransformHook.beforePageTransform, main, { ...source });

  // Build parent-child relationships map for nested blocks
  const parentChildMap = new Map();
  const childParentMap = new Map();
  
  inventoryBlocks.forEach((block) => {
    block.instances
      .filter((instance) => WebImporter.Import.findSiteUrl(instance, urls)?.url === originalURL)
      .forEach((instance) => {
        if (instance.nestedBlocks && Array.isArray(instance.nestedBlocks)) {
          // This instance is a parent
          parentChildMap.set(instance.uuid, instance.nestedBlocks);
          
          // Map each child to its parent
          instance.nestedBlocks.forEach((childUuid) => {
            childParentMap.set(childUuid, instance.uuid);
          });
        }
      });
  });

  // Separate parent blocks, child blocks, and regular blocks
  const allElements = [...defaultContentElements, ...blockElements, ...pageElements];
  const parentBlocks = [];
  const childBlocks = [];
  const regularBlocks = [];
  
  allElements.forEach((item) => {
    if (item.uuid && parentChildMap.has(item.uuid)) {
      parentBlocks.push(item);
    } else if (item.uuid && childParentMap.has(item.uuid)) {
      childBlocks.push(item);
    } else {
      regularBlocks.push(item);
    }
  });

  // Process blocks in order: parents first, then regular blocks, then children
  const processOrder = [
    ...parentBlocks.sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999)),
    ...regularBlocks.sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999)),
    ...childBlocks.sort((a, b) => (a.uuid ? parseInt(a.uuid.split('-')[1], 10) - parseInt(b.uuid.split('-')[1], 10) : 999))
  ];

  // Store references to parent sections for child placement
  const parentSections = new Map();

  processOrder
    .filter((item) => !fragmentElements.includes(item.element))
    .forEach((item, idx, arr) => {
      const { element = main, ...pageBlock } = item;
      const parserName = WebImporter.Import.getParserName(pageBlock);
      const parserFn = parsers[parserName];
      
      try {
        let parserElement = element;
        if (typeof parserElement === 'string') {
          parserElement = main.querySelector(parserElement);
        }
        
        // before parse hook
        WebImporter.Import.transform(
          TransformHook.beforeParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
            nextEl: arr[idx + 1],
          },
        );
        
        // Special handling for nested blocks
        if (item.uuid && parentChildMap.has(item.uuid)) {
          // This is a parent block - parse normally and store section reference
          if (parserFn) {
            parserFn.call(this, parserElement, { ...source });
            
            // Find the created section (look for the content div created by parent parser)
            const parentSection = main.querySelector('.parent-block-content');
            if (parentSection) {
              parentSections.set(item.uuid, parentSection);
            }
          }
        } else if (item.uuid && childParentMap.has(item.uuid)) {
          // This is a child block - parse and place inside parent section
          const parentUuid = childParentMap.get(item.uuid);
          const parentSection = parentSections.get(parentUuid);
          
          if (parserFn && parentSection) {
            // Create a temporary container for the child block
            const tempContainer = document.createElement('div');
            tempContainer.appendChild(parserElement.cloneNode(true));
            
            // Parse the child block in the temporary container
            const tempElement = tempContainer.firstChild;
            parserFn.call(this, tempElement, { ...source });
            
            // Move the parsed child block into the parent section
            while (tempContainer.firstChild) {
              parentSection.appendChild(tempContainer.firstChild);
            }
            
            // Remove the original child element from its location
            parserElement.remove();
          } else if (parserFn) {
            // Fallback: parse normally if parent section not found
            parserFn.call(this, parserElement, { ...source });
          }
        } else {
          // Regular block - parse normally
          if (parserFn) {
            parserFn.call(this, parserElement, { ...source });
          }
        }
        
        // after parse hook
        WebImporter.Import.transform(
          TransformHook.afterParse,
          parserElement,
          {
            ...source,
            ...pageBlock,
          },
        );
      } catch (e) {
        console.warn(`Failed to parse block: ${parserName}`, e);
      }
    });
}

/**
* Fragment transformation function
*/
function transformFragment(main, { fragment, inventory, ...source }) {
  const { document, params: { originalURL } } = source;

  if (fragment.name === 'nav') {
    const navEl = document.createElement('div');

    // get number of blocks in the nav fragment
    const navBlocks = Math.floor(fragment.instances.length / fragment.instances.filter((ins) => ins.uuid.includes('-00-')).length);
    console.log('navBlocks', navBlocks);

    for (let i = 0; i < navBlocks; i += 1) {
      const { xpath } = fragment.instances[i];
      const el = WebImporter.Import.getElementByXPath(document, xpath);
      if (!el) {
        console.warn(`Failed to get element for xpath: ${xpath}`);
      } else {
        navEl.append(el);
      }
    }

    // body width
    const bodyWidthAttr = document.body.getAttribute('data-hlx-imp-body-width');
    const bodyWidth = bodyWidthAttr ? parseInt(bodyWidthAttr, 10) : 1000;

    try {
      const headerBlock = headerParser(navEl, {
        ...source, document, fragment, bodyWidth,
      });
      main.append(headerBlock);
    } catch (e) {
      console.warn('Failed to parse header block', e);
    }
  } else {
    (fragment.instances || [])
      .filter((instance) => {
        const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
        if (!siteUrl) {
          return false;
        }
        return `${siteUrl.url}#${fragment.name}` === originalURL;
      })
      .map(({ xpath }) => ({
        xpath,
        element: WebImporter.Import.getElementByXPath(document, xpath),
      }))
      .filter(({ element }) => element)
      .forEach(({ xpath, element }) => {
        main.append(element);

        const fragmentBlock = inventory.blocks
          .find(({ instances }) => instances.find((instance) => {
            const siteUrl = WebImporter.Import.findSiteUrl(instance, inventory.urls);
            return `${siteUrl.url}#${fragment.name}` === originalURL && instance.xpath === xpath;
          }));

        if (!fragmentBlock) return;
        const parserName = WebImporter.Import.getParserName(fragmentBlock);
        const parserFn = parsers[parserName];
        if (!parserFn) return;
        try {
          parserFn.call(this, element, source);
        } catch (e) {
          console.warn(`Failed to parse block: ${fragmentBlock.key}, with xpath: ${xpath}`, e);
        }
      });
  }
}

export default {
  onLoad: async (payload) => {
    await handleOnLoad(payload);
  },

  transform: async (payload) => {
    const { document, params: { originalURL } } = payload;

    /* eslint-disable-next-line prefer-const */
    let publishUrl = window.location.origin;
    // $$publishUrl = '{{{publishUrl}}}';

    let inventory = null;
    // $$inventory = {{{inventory}}};
    if (!inventory) {
      const siteUrlsUrl = new URL('/tools/importer/site-urls.json', publishUrl);
      const inventoryUrl = new URL('/tools/importer/inventory.json', publishUrl);
      try {
        // fetch and merge site-urls and inventory
        const siteUrlsResp = await fetch(siteUrlsUrl.href);
        const inventoryResp = await fetch(inventoryUrl.href);
        const siteUrls = await siteUrlsResp.json();
        inventory = await inventoryResp.json();
        inventory = mergeInventory(siteUrls, inventory, publishUrl);
      } catch (e) {
        console.error('Failed to merge site-urls and inventory');
      }
      if (!inventory) {
        return [];
      }
    }

    let main = document.body;

    // before transform hook
    WebImporter.Import.transform(TransformHook.beforeTransform, main, { ...payload, inventory });

    // perform the transformation
    let path = null;
    const sourceUrl = new URL(originalURL);
    const fragName = sourceUrl.hash ? sourceUrl.hash.substring(1) : '';
    if (fragName) {
      // fragment transformation
      const fragment = inventory.fragments.find(({ name }) => name === fragName);
      if (!fragment) {
        return [];
      }
      main = document.createElement('div');
      transformFragment(main, { ...payload, fragment, inventory });
      path = fragment.path;
    } else {
      // page transformation
      transformPage(main, { ...payload, inventory });
      path = generateDocumentPath(payload, inventory);
    }

    // after transform hook
    WebImporter.Import.transform(TransformHook.afterTransform, main, { ...payload, inventory });

    return [{
      element: main,
      path,
    }];
  },
};
