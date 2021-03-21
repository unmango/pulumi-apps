import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import { ComponentResourceOptions, Input } from '@pulumi/pulumi';
import { AppBase, AppConstructor } from './app-base';

type AppConstructorArgs<T extends pulumi.Inputs> = HelmArgs & T;

export class HelmApp<T extends pulumi.Inputs = pulumi.Inputs> extends AppBase {

  public readonly app: k8s.helm.v3.Chart;

  constructor(
    app: string,
    chartArgs: ChartArgs,
    name: string,
    args: AppConstructorArgs<T>,
    opts?: ComponentResourceOptions) {
    super(app, name, opts);

    this.app = new k8s.helm.v3.Chart(this.getName(), {
      chart: chartArgs.chart,
      fetchOpts: { repo: chartArgs.repoUrl },
      namespace: args.namespace,
      version: args.version ?? chartArgs.version,
      values: args,
    }, { parent: this });;
  }

    this.app = new k8s.helm.v3.Chart(this.getName(), {
      chart: chartArgs.chart,
      fetchOpts: { repo: chartArgs.repoUrl },
      namespace: args.namespace,
      version: args.version ?? chartArgs.version,
      values: values,
    }, { parent: this });
  }
}

type GetApp<T extends Args, U extends pulumi.Inputs> =
  T extends HelmArgs ? HelmApp<U> :
  T extends RancherArgs ? RancherApp<U> :
  never;

export type AppParams<T extends Args, U extends pulumi.Inputs> = [
  name: string,
  args: T & U,
  opts?: ComponentResourceOptions,
];

type NewAppCore = <T extends Args, U extends pulumi.Inputs>(...ctor: Ctor<T, U>) => GetApp<T, U>;
type NewApp<T extends pulumi.Inputs> = <U extends Args>(...params: AppParams<U, T>) => GetApp<U, T>;

const newAppCore: NewAppCore = newApp;

export function newAppFactory<T extends pulumi.Inputs>(appName: string, chartArgs: ChartArgs): NewApp<T> {
  return (name, args, opts) => newAppCore(appName, name, args, args, chartArgs, opts);
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
  catalog: Input<string>;
  repoUrl: Input<string>;
  chart: Input<string>;
  version: Input<string>;
}

export interface HelmArgs {
  namespace: Input<string>;
  version?: Input<string>;
}
