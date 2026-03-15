declare module 'axios';
declare module 'lucide-react';
declare module 'recharts';
declare module 'zustand';
declare module 'input-otp';
declare module 'react-resizable-panels';
declare module 'cmdk';

declare module 'react' {
  const React: any;
  export default React;
  export function useState<T = any>(initialState?: T | (() => T)):
    [T, (v: T | ((prev: T) => T)) => void];
  export function useEffect(cb: () => void | (() => void), deps?: any[]): void;
  export function useRef<T = any>(initial?: T): { current: T };
  export function useMemo<T>(cb: () => T, deps?: any[]): T;

  // Basic types used in components
  export type ReactNode = any;
  export interface FC<P = {}> {
    (props: P & { children?: ReactNode }): ReactNode;
    displayName?: string;
  }
  export interface ChangeEvent<T = any> { target: T; }
  export interface FormEvent { preventDefault(): void; }
}

declare module 'react-dom' {
  const ReactDOM: any;
  export default ReactDOM;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props?: any, key?: any): any;
  export function jsxs(type: any, props?: any, key?: any): any;
  export function jsxDEV(type: any, props?: any, key?: any): any;
}

declare global {
  namespace React {
    type ReactNode = any;
    type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactNode;
    interface ChangeEvent<T = any> { target: T; }
    interface FormEvent { preventDefault(): void; }
  }
}

declare module 'zustand' {
  export default function create<T = any>(fn: (set: any, get?: any) => T): () => T;
}
