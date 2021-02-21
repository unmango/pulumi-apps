import { Input } from '@pulumi/pulumi';
import { HelmApp, HelmAppConstructorParameters } from '../helm-app';
import { BitnamiArgs } from './common';

type Args = HelmAppConstructorParameters<HarborArgs>;

export class Harbor extends HelmApp<HarborArgs> {

  constructor(...args: Args) {
    const temp = HelmApp.getBaseArgs(args, {});
    const name = args[0];
    const appArgs = args[1];
    const opts = args[2];
    super('harbor', name, {}, appArgs, opts);

    this.registerOutputs();
  }

}

export interface HarborArgs extends BitnamiArgs {
  registry: Input<string>;
}
