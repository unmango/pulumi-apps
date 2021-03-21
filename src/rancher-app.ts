import * as pulumi from '@pulumi/pulumi';
import { ComponentResourceOptions, Input } from '@pulumi/pulumi';
import { AppV2 } from '@pulumi/rancher2';
import { AppBase, AppConstructor } from './app-base';
import * as util from './util';

type AppConstructorArgs<T extends pulumi.Inputs> = RancherArgs & T;

export class RancherApp<T extends pulumi.Inputs = pulumi.Inputs> extends AppBase {

  public readonly app: AppV2;

  constructor(
    app: string,
    chartArgs: ChartArgs,
    name: string,
    args: AppConstructorArgs<T>,
    opts?: ComponentResourceOptions) {
    super(app, name, opts);

    const values: T = args;

    this.app = new AppV2(this.getName(), {
      clusterId: args.clusterId,
      projectId: args.projectId,
      namespace: args.namespace,
      repoName: chartArgs.repo, // Catalog name
      chartName: chartArgs.chart,
      chartVersion: args.version ?? chartArgs.version,
      values: util.toYaml(values),
    }, { parent: this });
  }

}

// TODO: Allow fetching from existing catalog
export interface ChartArgs {
  repo: Input<string>;
  repoUrl: Input<string>;
  chart: Input<string>;
  version: Input<string>;
}

export interface RancherArgs {
  namespace: Input<string>;
  version?: Input<string>;
  clusterId: Input<string>;
  projectId?: Input<string>;
}

export type RancherAppConstructor<
  T extends pulumi.Inputs
  > = AppConstructor<RancherApp<T>, AppConstructorArgs<T>>;

export type RancherAppConstructorParameters<
  T extends pulumi.Inputs
  > = ConstructorParameters<RancherAppConstructor<T>>;
