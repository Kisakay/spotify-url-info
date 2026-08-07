declare module "himalaya" {
  export interface HimalayaAttribute {
    key: string;
    value: string;
  }

  export interface HimalayaTextNode {
    type: "text";
    content: string;
  }

  export interface HimalayaElement {
    type: "element";
    tagName: string;
    attributes: HimalayaAttribute[];
    children: (HimalayaElement | HimalayaTextNode)[];
  }

  export type HimalayaNode = HimalayaElement | HimalayaTextNode;

  export function parse(html: string): HimalayaNode[];
}
