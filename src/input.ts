import { Input } from '@pulumi/pulumi';

export type InputArray<T> = Input<Input<T>[]>;
