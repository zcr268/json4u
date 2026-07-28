import type { MonacoApi } from "@/lib/editor/types.d.ts";
import type { MyWorker } from "@/lib/worker/worker";
import type { Remote } from "comlink";
import en from "../messages/en.json";

type Messages = typeof en;
export type MessageKey = MessageKeys<IntlMessages, "">;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}

  interface Console {
    l: (...args: any[]) => void;
  }

  interface Window {
    rawWorker: Worker;
    worker: Remote<MyWorker>;
    monacoApi: MonacoApi;
    searchComponents: Record<string, any>;
  }
}

// https://www.webdevluis.com/blog/fix-typescript-cannot-find-module-declaration-error-mdx-react
declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}
