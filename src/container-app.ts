import * as k8s from '@pulumi/kubernetes';
import { ComponentResourceOptions, CustomResourceOptions, Input, Output } from '@pulumi/pulumi';
import * as pulumi from '@pulumi/pulumi';
import { AppBase } from './app-base';

type Workload =
  | k8s.apps.v1.Deployment
  | k8s.apps.v1.StatefulSet
  | k8s.apps.v1.DaemonSet;

type WorkloadSpec =
  | k8s.types.input.apps.v1.DeploymentSpec
  | k8s.types.input.apps.v1.StatefulSetSpec
  | k8s.types.input.apps.v1.DaemonSetSpec;

type GetWorkloadSpec<T extends Workload> =
  T extends k8s.apps.v1.Deployment ?
  k8s.types.input.apps.v1.DeploymentSpec :
  T extends k8s.apps.v1.StatefulSet ?
  k8s.types.input.apps.v1.StatefulSetSpec :
  T extends k8s.apps.v1.DaemonSet ?
  k8s.types.input.apps.v1.DaemonSetSpec :
  never;

type GetWorkloadArgs<T extends Workload> =
  T extends k8s.apps.v1.Deployment ?
  k8s.apps.v1.DeploymentArgs :
  T extends k8s.apps.v1.StatefulSet ?
  k8s.apps.v1.StatefulSetArgs :
  T extends k8s.apps.v1.DaemonSet ?
  k8s.apps.v1.DaemonSetArgs :
  never;

type CreateWorkload<T extends Workload> = {
  new(name: string, args: GetWorkloadArgs<T>, opts?: CustomResourceOptions): T;
};

interface Args<TSpec extends WorkloadSpec = k8s.types.input.apps.v1.DeploymentSpec> {
  namespace: Input<string>;
  workload: Input<TSpec & {
    name?: Input<string>;
  }>;
  service?: Input<k8s.types.input.core.v1.ServiceSpec & {
    name?: Input<string>;
  }>;
  ingress?: Input<k8s.types.input.networking.v1.IngressSpec & {
    name?: Input<string>;
  }>;
}

export abstract class ContainerApp<
  TWorkload extends Workload = k8s.apps.v1.Deployment,
  TArgs extends Args = Args<GetWorkloadSpec<TWorkload>>,
  > extends AppBase {

  // public readonly workload: TWorkload;
  public readonly service?: Output<k8s.core.v1.Service>;
  public readonly ingress?: Output<k8s.networking.v1.Ingress>;

  constructor(app: string, name: string, args: TArgs, opts?: ComponentResourceOptions) {
    super(app, name, opts);

    // this.workload = new CreateWorkload<TWorkload>('', args.workload, {});

    // const temp = new CreateWorkload<TWorkload>('', {}, undefined);

    if (args.service) {
      this.service = pulumi.output(args.service).apply(x => {
        return new k8s.core.v1.Service(this.getName(), {
          metadata: this.getMetadata(args, x),
          spec: args.service,
        }, { parent: this });
      });
    }

    if (args.ingress) {
      this.ingress = pulumi.output(args.ingress).apply(x => {
        return new k8s.networking.v1.Ingress(this.getName(), {
          metadata: this.getMetadata(args, x),
          spec: args.ingress,
        }, { parent: this });
      });
    }
  }

  private getMetadata(
    ns: { namespace: Input<string>; },
    n: { name?: Input<string>; },
  ): k8s.types.input.meta.v1.ObjectMeta {
    return { namespace: ns.namespace, name: n.name };
  }

}

export type ContainerAppArgs<
  T extends WorkloadSpec = k8s.types.input.apps.v1.DeploymentSpec
  > = Args<T>;
