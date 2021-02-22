import { Input } from '@pulumi/pulumi';
import { HelmApp, HelmAppConstructorParameters } from '../helm-app';
import { BitnamiArgs, CommonArgs, getAppArgs } from './common';

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
  caBundleSecretName?: Input<string>;
  kubeVersion?: Input<string>;
  internalTls?: Input<{
    enabled?: Input<boolean>;
  }>;
  logLevel?: Input<string>;

  /**
   * Option to ensure all passwords and keys are set by the user.
   */
  forcePassword?: Input<string>;

  harborAdminPassword?: Input<string>;
}
