import { Input } from '@pulumi/pulumi';

interface GlobalArgs {
  registry?: Input<string>;
}

export interface BitnamiArgs {
  global?: GlobalArgs;
}
