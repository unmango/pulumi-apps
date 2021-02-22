import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import { ComponentResourceOptions, Input } from '@pulumi/pulumi';
import { AppV2 } from '@pulumi/rancher2';
import { AppBase, AppConstructor, AppConstructorParameters } from './app-base';
import * as util from './util';

interface BaseArgs {
  method: 'helm' | 'rancher';
  namespace: Input<string>;
  version?: Input<string>;
}

interface RancherArgs extends BaseArgs {
  method: 'rancher';
  clusterId: Input<string>;
  projectId?: Input<string>;
}

interface HelmArgs extends BaseArgs {
  method: 'helm';
}

type Args = RancherArgs | HelmArgs;

type AppConstructorArgs<T extends pulumi.Inputs> = Args & T;

export class HelmApp<T extends pulumi.Inputs = pulumi.Inputs> extends AppBase {

  public readonly chartApp?: k8s.helm.v3.Chart;
  public readonly rancherApp?: AppV2;

  constructor(app: string, chartArgs: ChartArgs, name: string, args: AppConstructorArgs<T>, opts?: ComponentResourceOptions) {
    super(app, name, opts);

    const values: T = args;

    switch (args.method) {
    case 'helm':
      this.chartApp = new k8s.helm.v3.Chart(this.getName(), {
        chart: chartArgs.chart,
        fetchOpts: { repo: chartArgs.repoUrl },
        namespace: args.namespace,
        version: args.version ?? chartArgs.version,
        values: values,
      }, { parent: this });
      break;
    case 'rancher':
      this.rancherApp = new AppV2(this.getName(), {
        clusterId: args.clusterId,
        projectId: args.projectId,
        namespace: args.namespace,
        repoName: chartArgs.repo, // Catalog name
        chartName: chartArgs.chart,
        chartVersion: args.version ?? chartArgs.version,
        values: util.toYaml(values),
      }, { parent: this });
      break;
    }
  }

}

// TODO: Allow fetching from existing catalog
export interface ChartArgs {
  repo: Input<string>;
  repoUrl: Input<string>;
  chart: Input<string>;
  version: Input<string>;
}

export type HelmAppArgs = Args;

export type HelmAppConstructor<
  T extends pulumi.Inputs
  > = AppConstructor<HelmApp<T>, AppConstructorArgs<T>>;

export type HelmAppConstructorParameters<
  T extends pulumi.Inputs
  > = ConstructorParameters<HelmAppConstructor<T>>;
