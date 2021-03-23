import { Input } from '@pulumi/pulumi';

// https://github.com/Microsoft/TypeScript/issues/15300#issuecomment-771916993
type Typify<T> = { [K in keyof T]: T[K] };

export type InputArray<T> = Input<Input<T>[]>;

// WIP
export type AsInputs<T> =
  T extends Record<string, unknown> ? {
    [K in keyof T]: Input<AsInputs<T[K]>>;
  } :
  T extends Array<infer V> ? InputArray<V> :
  T extends Input<unknown> | InputArray<unknown> ? T :
  Input<T>;
