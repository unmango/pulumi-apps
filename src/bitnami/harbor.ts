import { Input } from '@pulumi/pulumi';
import { HelmApp, HelmAppConstructorParameters } from '../helm-app';
import { BitnamiArgs, getAppArgs } from './common';

type Args = HelmAppConstructorParameters<HarborArgs>;

export class Harbor extends HelmApp<HarborArgs> {

  public static readonly chart = 'harbor';
  public static readonly defaultVersion = '9.4.7';

  public readonly defaultVersion = Harbor.defaultVersion;

  constructor(...args: Args) {
    super('harbor', getAppArgs(
      Harbor.chart,
      Harbor.defaultVersion,
    ), ...args);

    this.registerOutputs();
  }

}

export interface HarborArgs extends BitnamiArgs {
  registry: Input<string>;
}
