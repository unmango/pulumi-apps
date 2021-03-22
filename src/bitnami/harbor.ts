import { Input } from '@pulumi/pulumi';
import { newAppFactory } from '../helm-app';
import { BitnamiArgs, getChartArgs } from './common';

export const chart = 'harbor';
export const defaultVersion = '9.4.7';

export const newHarbor = newAppFactory<HarborArgs>(
  'harbor',
  getChartArgs(chart, defaultVersion),
);

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
