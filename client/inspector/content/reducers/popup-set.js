/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const initialState = [{
  id: "inspector-node-popup",
  items: [
    {
        "id": "node-menu-edithtml",
        "label": ";AMP;inspectorHTMLEdit.label;",
        "accesskey": ";AMP;inspectorHTMLEdit.accesskey;",
        "oncommand": "inspector.editHTML()"
    },
    {
        "id": "node-menu-copyinner",
        "label": ";AMP;inspectorHTMLCopyInner.label;",
        "accesskey": ";AMP;inspectorHTMLCopyInner.accesskey;",
        "oncommand": "inspector.copyInnerHTML()"
    },
    {
        "id": "node-menu-copyouter",
        "label": ";AMP;inspectorHTMLCopyOuter.label;",
        "accesskey": ";AMP;inspectorHTMLCopyOuter.accesskey;",
        "oncommand": "inspector.copyOuterHTML()"
    },
    {
        "id": "node-menu-copyuniqueselector",
        "label": ";AMP;inspectorCopyUniqueSelector.label;",
        "accesskey": ";AMP;inspectorCopyUniqueSelector.accesskey;",
        "oncommand": "inspector.copyUniqueSelector()"
    },
    {
        "id": "node-menu-copyimagedatauri",
        "label": ";AMP;inspectorCopyImageDataUri.label;",
        "oncommand": "inspector.copyImageDataUri()"
    },
    {
        "id": "node-menu-showdomproperties",
        "label": ";AMP;inspectorShowDOMProperties.label;",
        "oncommand": "inspector.showDOMProperties()"
    },
    {
        "id": "node-menu-useinconsole",
        "label": ";AMP;inspectorUseInConsole.label;",
        "oncommand": "inspector.useInConsole()"
    },
    {
        "id": "node-menu-expand",
        "label": ";AMP;inspectorExpandNode.label;",
        "oncommand": "inspector.expandNode()"
    },
    {
        "id": "node-menu-collapse",
        "label": ";AMP;inspectorCollapseNode.label;",
        "oncommand": "inspector.collapseNode()"
    },
    {
        "type": "separator"
    },
    {
        "id": "node-menu-pasteinnerhtml",
        "label": ";AMP;inspectorHTMLPasteInner.label;",
        "accesskey": ";AMP;inspectorHTMLPasteInner.accesskey;",
        "oncommand": "inspector.pasteInnerHTML()"
    },
    {
        "id": "node-menu-pasteouterhtml",
        "label": ";AMP;inspectorHTMLPasteOuter.label;",
        "accesskey": ";AMP;inspectorHTMLPasteOuter.accesskey;",
        "oncommand": "inspector.pasteOuterHTML()"
    },
    {
        "type": "menu",
        "id": "node-menu-paste-extra-submenu",
        "label": ";AMP;inspectorHTMLPasteExtraSubmenu.label;",
        "accesskey": ";AMP;inspectorHTMLPasteExtraSubmenu.accesskey;",
        "items": [
            {
                "id": "node-menu-pastebefore",
                "label": ";AMP;inspectorHTMLPasteBefore.label;",
                "accesskey": ";AMP;inspectorHTMLPasteBefore.accesskey;",
                "oncommand": "inspector.pasteAdjacentHTML('beforeBegin')"
            },
            {
                "id": "node-menu-pasteafter",
                "label": ";AMP;inspectorHTMLPasteAfter.label;",
                "accesskey": ";AMP;inspectorHTMLPasteAfter.accesskey;",
                "oncommand": "inspector.pasteAdjacentHTML('afterEnd')"
            },
            {
                "id": "node-menu-pastefirstchild",
                "label": ";AMP;inspectorHTMLPasteFirstChild.label;",
                "accesskey": ";AMP;inspectorHTMLPasteFirstChild.accesskey;",
                "oncommand": "inspector.pasteAdjacentHTML('afterBegin')"
            },
            {
                "id": "node-menu-pastelastchild",
                "label": ";AMP;inspectorHTMLPasteLastChild.label;",
                "accesskey": ";AMP;inspectorHTMLPasteLastChild.accesskey;",
                "oncommand": "inspector.pasteAdjacentHTML('beforeEnd')"
            }
        ]
    },
    {
        "type": "separator"
    },
    {
        "id": "node-menu-scrollnodeintoview",
        "label": ";AMP;inspectorScrollNodeIntoView.label;",
        "accesskey": ";AMP;inspectorScrollNodeIntoView.accesskey;",
        "oncommand": "inspector.scrollNodeIntoView()"
    },
    {
        "id": "node-menu-screenshotnode",
        "label": ";AMP;inspectorScreenshotNode.label;",
        "oncommand": "inspector.screenshotNode()"
    },
    {
        "id": "node-menu-duplicatenode",
        "label": ";AMP;inspectorDuplicateNode.label;",
        "oncommand": "inspector.duplicateNode()"
    },
    {
        "id": "node-menu-delete",
        "label": ";AMP;inspectorHTMLDelete.label;",
        "accesskey": ";AMP;inspectorHTMLDelete.accesskey;",
        "oncommand": "inspector.deleteNode()"
    },
    {
        "type": "menu",
        "label": ";AMP;inspectorAttributeSubmenu.label;",
        "accesskey": ";AMP;inspectorAttributeSubmenu.accesskey;",
        "items": [
            {
                "id": "node-menu-add-attribute",
                "label": ";AMP;inspectorAddAttribute.label;",
                "accesskey": ";AMP;inspectorAddAttribute.accesskey;",
                "oncommand": "inspector.onAddAttribute()"
            },
            {
                "id": "node-menu-edit-attribute",
                "label": ";AMP;inspectorEditAttribute.label;",
                "accesskey": ";AMP;inspectorEditAttribute.accesskey;",
                "oncommand": "inspector.onEditAttribute()"
            },
            {
                "id": "node-menu-remove-attribute",
                "label": ";AMP;inspectorRemoveAttribute.label;",
                "accesskey": ";AMP;inspectorRemoveAttribute.accesskey;",
                "oncommand": "inspector.onRemoveAttribute()"
            }
        ]
    },
    {
        "type": "separator",
        "id": "node-menu-link-separator"
    },
    {
        "id": "node-menu-link-follow",
        "oncommand": "inspector.onFollowLink()"
    },
    {
        "id": "node-menu-link-copy",
        "oncommand": "inspector.onCopyLink()"
    },
    {
        "type": "separator",
    },
    {
        "id": "node-menu-pseudo-hover",
        "label": ":hover",
        "type": "checkbox",
        "oncommand": "inspector.togglePseudoClass(':hover')"
    },
    {
        "id": "node-menu-pseudo-active",
        "label": ":active",
        "type": "checkbox",
        "oncommand": "inspector.togglePseudoClass(':active')"
    },
    {
        "id": "node-menu-pseudo-focus",
        "label": ":focus",
        "type": "checkbox",
        "oncommand": "inspector.togglePseudoClass(':focus')"
    }
  ]}
];

function popupset(state = initialState, action) {
  // No actions for now
  return state;
}

// Exports from this module
exports.popupset = popupset;

