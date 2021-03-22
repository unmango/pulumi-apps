import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import { ComponentResourceOptions, Input } from '@pulumi/pulumi';
import { AppV2 } from '@pulumi/rancher2';
import { AppBase, AppConstructorParameters } from './app-base';
import * as util from './util';

interface BaseArgs {
  method: 'helm' | 'rancher';
  namespace: Input<string>;
  version?: Input<string>;
}

export interface RancherArgs extends BaseArgs {
  method: 'rancher';
  clusterId: Input<string>;
  projectId?: Input<string>;
}

export interface HelmArgs extends BaseArgs {
  method: 'helm';
  temp: Input<string>;
}

export type Args = RancherArgs | HelmArgs;

type Ctor<T extends Args, U extends pulumi.Inputs> = [
  appName: string,
  name: string,
  args: T,
  values: U,
  chartArgs: ChartArgs,
  opts?: ComponentResourceOptions,
];

export class HelmApp<T extends pulumi.Inputs> extends AppBase {

  public readonly app: k8s.helm.v3.Chart;

  constructor(...ctor: Ctor<HelmArgs, T>) {
    const [appName, name, args, values, chartArgs, opts] = ctor;
    super(appName, name, opts);

    this.app = new k8s.helm.v3.Chart(this.getName(), {
      chart: chartArgs.chart,
      fetchOpts: { repo: chartArgs.repoUrl },
      namespace: args.namespace,
      version: args.version ?? chartArgs.version,
      values: args,
    }, { parent: this });;
  }

}

export class RancherApp<T extends pulumi.Inputs> extends AppBase {

  public readonly app: AppV2;

  constructor(...ctor: Ctor<RancherArgs, T>) {
    const [appName, name, args, values, chartArgs, opts] = ctor;
    super(appName, name, opts);

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

type AppUnion<T extends pulumi.Inputs> = HelmApp<T> | RancherApp<T>;

export function newApp<T extends pulumi.Inputs>(...ctor: Ctor<HelmArgs, T>): HelmApp<T>;
export function newApp<T extends pulumi.Inputs>(...ctor: Ctor<RancherArgs, T>): RancherApp<T>;
export function newApp<T extends pulumi.Inputs>(...ctor: Ctor<Args, T>): AppUnion<T> {
  const [appName, name, args, values, chartArgs, opts] = ctor;

  switch (args.method) {
    case 'helm':
      return new HelmApp<T>(appName, name, args, values, chartArgs, opts);
    case 'rancher':
      return new RancherApp<T>(appName, name, args, values, chartArgs, opts);
  }
}

type GetApp<T extends Args, U extends pulumi.Inputs> =
  T extends HelmArgs ? HelmApp<U> :
  T extends RancherArgs ? RancherApp<U> :
  never;

export type AppParams<T extends Args, U extends pulumi.Inputs> = [
  name: string,
  args: T,
  values: U,
  opts?: ComponentResourceOptions,
];

type NewAppCore = <T extends Args, U extends pulumi.Inputs>(...ctor: Ctor<T, U>) => GetApp<T, U>;
type NewApp = <T extends Args, U extends pulumi.Inputs>(...params: AppParams<T, U>) => GetApp<T, U>;

const newAppCore: NewAppCore = newApp;

export function newAppFactory(appName: string, chartArgs: ChartArgs): NewApp {
  return (name, args, values, opts) => newAppCore(appName, name, args, values, chartArgs, opts);
}

// export type CtorParamUnion<T extends pulumi.Inputs> =
//   | AppConstructorParameters<HelmArgs & T>
//   | AppConstructorParameters<RancherArgs & T>;

// export type NewHelmApp<T extends pulumi.Inputs> = (...ctor: AppConstructorParameters<HelmArgs & T>) => HelmApp<T>;
// export type NewRancherApp<T extends pulumi.Inputs> = (...ctor: AppConstructorParameters<RancherArgs & T>) => RancherApp<T>;
// export type NewAppUnion<T extends pulumi.Inputs> = NewHelmApp<T> | NewRancherApp<T>;

// export type NewApp<T> = (...ctor: CtorParamUnion<T>) => AppUnion<T>;

// export function newHelmAppFactory<T extends pulumi.Inputs>(appName: string, chartArgs: ChartArgs): NewApp<T> {
//   return (...ctor: CtorParamUnion<T>) => {
//     const [name, args, opts] = ctor;

//     switch (args.method) {
//       case 'helm':
//         return new HelmApp<T>(appName, name, args, opts, chartArgs);
//       case 'rancher':
//         return new RancherApp<T>(appName, name, args, opts, chartArgs);
//     }
//   };
// }

// type AppGetterFull<T extends pulumi.Inputs> = <U extends Args>(
//   appName: string,
//   name: string,
//   args: U & T,
//   chartArgs: ChartArgs,
//   opts?: ComponentResourceOptions
// ) => GetApp<U, T>;

// type AppGetter<T extends pulumi.Inputs> = <U extends Args>(
//   name: string,
//   args: U & T,
//   opts?: ComponentResourceOptions
// ) => GetApp<U, T>;

// function newAppCore<T extends pulumi.Inputs>(appName: string, name: string, args: HelmArgs & T, chartArgs: ChartArgs, opts?: ComponentResourceOptions): HelmApp<T>;
// function newAppCore<T extends pulumi.Inputs>(appName: string, name: string, args: RancherArgs & T, chartArgs: ChartArgs, opts?: ComponentResourceOptions): RancherApp<T>;
// function newAppCore<T extends pulumi.Inputs>(appName: string, name: string, args: HelmArgs & T | RancherArgs & T, chartArgs: ChartArgs, opts?: ComponentResourceOptions): AppUnion<T> {
//   switch (args.method) {
//     case 'helm':
//       return new HelmApp<T>(appName, name, args, args, chartArgs, opts);
//     case 'rancher':
//       return new RancherApp<T>(appName, name, args, args, chartArgs, opts);
//   }
// }

// const newAppFactoryFull = <T extends pulumi.Inputs>(): AppGetterFull<T> => newAppCore;
// export function newAppFactory<T extends pulumi.Inputs>(appName: string, chartArgs: ChartArgs): AppGetter<T> {
//   return (name, args, opts) => newAppFactoryFull<T>()(appName, name, args, chartArgs, opts);
// }

// TODO: Allow fetching from existing catalog
export interface ChartArgs {
  repo: Input<string>;
  repoUrl: Input<string>;
  chart: Input<string>;
  version: Input<string>;
}

export type HelmAppArgs = Args;
