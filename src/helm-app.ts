import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import { ComponentResourceOptions, Input } from '@pulumi/pulumi';
import { AppV2 } from '@pulumi/rancher2';
import { AppBase, AppConstructor, AppConstructorParameters } from './app-base';
import * as util from './util';

interface BaseArgs {
  method: 'helm' | 'rancher';
  namespace: Input<string>;
  repo: Input<string>;
  chart: Input<string>;
  version: Input<string>;
}

interface RancherArgs extends BaseArgs {
  method: 'rancher';
  clusterId: Input<string>;
  projectId?: Input<string>;
}

interface HelmArgs extends BaseArgs {
  method: 'helm';
  test: Input<string>
}

type ChartOnly = 'repo' | 'chart' | 'version';

type Args = RancherArgs | HelmArgs;

type AppConstructorArgs<T> =
  Omit<Args, ChartOnly>
  & Partial<Pick<Args, 'version'>>
  & T;

export class HelmApp<T extends pulumi.Inputs> extends AppBase {

  public readonly chartApp?: k8s.helm.v3.Chart;
  public readonly rancherApp?: AppV2;

  constructor(app: string, name: string, args: Args, values: T, opts?: ComponentResourceOptions) {
    super(app, name, opts);

    switch (args.method) {
    case 'helm':
      this.chartApp = new k8s.helm.v3.Chart(this.getName(), {
        chart: args.chart,
        fetchOpts: { repo: args.repo },
        namespace: args.namespace,
        version: args.version,
        values: values,
      }, { parent: this });
      break;
    case 'rancher':
      this.rancherApp = new AppV2(this.getName(), {
        clusterId: args.clusterId,
        projectId: args.projectId,
        namespace: args.namespace,
        repoName: args.repo,
        chartName: args.chart,
        chartVersion: args.version,
        values: util.toYaml(values),
      }, { parent: this });
      break;
    }
  }

  protected static getBaseArgs<T>(args: AppConstructorArgs<T>, chartArgs: Pick<Args, ChartOnly>): Args {
    switch (args.method) {
    case 'helm':
      return { ...args, ...chartArgs };
    case 'rancher':
      return { ...args, ...chartArgs };
    }
  }

}

export type HelmAppArgs = Args;

export type HelmAppConstructor<
  T extends pulumi.Inputs
  > = AppConstructor<HelmApp<T>, AppConstructorArgs<T>>;

export type HelmAppConstructorParameters<
  T extends pulumi.Inputs
  > = ConstructorParameters<HelmAppConstructor<T>>;
