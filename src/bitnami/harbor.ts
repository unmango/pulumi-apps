import { Input } from '@pulumi/pulumi';
import { HelmApp, HelmAppConstructorParameters } from '../helm-app';
import { BitnamiArgs } from './common';

type Args = HelmAppConstructorParameters<HarborArgs>;

export class Harbor extends HelmApp<HarborArgs> {

  public static readonly repo = 'bitnami';
  public static readonly chart = 'harbor';
  public static readonly defaultVersion = '9.4.7';

  public readonly defaultVersion = Harbor.defaultVersion;

  constructor(...args: Args) {
    super('harbor', {
      repo: Harbor.repo,
      chart: Harbor.chart,
      version: Harbor.defaultVersion,
    }, ...args);

    this.registerOutputs();
  }

}

export interface HarborArgs extends BitnamiArgs {
  registry: Input<string>;
}
