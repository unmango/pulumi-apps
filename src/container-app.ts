import * as k8s from '@pulumi/kubernetes';
import { ComponentResourceOptions, CustomResourceOptions, Input, Output } from '@pulumi/pulumi';
import * as pulumi from '@pulumi/pulumi';
import { AppBase } from './app-base';

type WorkloadDiscriminator = {
  type: 'Deployment' | 'StatefulSet' | 'DaemonSet';
};

type Deployment = k8s.apps.v1.Deployment;
type StatefulSet = k8s.apps.v1.StatefulSet;
type DaemonSet = k8s.apps.v1.DaemonSet;

type DeploymentSpec = k8s.types.input.apps.v1.DeploymentSpec & { type: 'Deployment'; };
type StatefulSetSpec = k8s.types.input.apps.v1.StatefulSet & { type: 'StatefulSet'; };
type DaemonSetSpec = k8s.types.input.apps.v1.DaemonSet & { type: 'DaemonSet'; };

type Workload =
  | Deployment
  | StatefulSet
  | DaemonSet;

type WorkloadSpec =
  | DeploymentSpec
  | StatefulSetSpec
  | DaemonSetSpec;

type GetWorkloadSpec<T extends Workload> =
  T extends Deployment ? DeploymentSpec :
  T extends StatefulSet ? StatefulSetSpec :
  T extends DaemonSet ? DaemonSetSpec :
  never;

type GetWorkloadArgs<T extends Workload> =
  T extends Deployment ? k8s.apps.v1.DeploymentArgs :
  T extends StatefulSet ? k8s.apps.v1.StatefulSetArgs :
  T extends DaemonSet ? k8s.apps.v1.DaemonSetArgs :
  never;

type CreateWorkload<T extends Workload> = {
  new(name: string, args?: GetWorkloadArgs<T>, opts?: CustomResourceOptions): T;
};

interface Args<TSpec extends WorkloadSpec = DeploymentSpec> {
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
  TWorkload extends Workload = Deployment,
  > extends AppBase {

  // public readonly workload: TWorkload;
  public readonly service?: k8s.core.v1.Service;
  public readonly ingress?: k8s.networking.v1.Ingress;

  constructor(app: string, name: string, args: Args<GetWorkloadSpec<TWorkload>>, opts?: ComponentResourceOptions) {
    super(app, name, opts);

    // this.workload = pulumi.output(args.workload).apply(x => {
    //   switch (x.type) {
    //   case 'Deployment':
    //     return new k8s.apps.v1.Deployment(this.getName(), {
    //       metadata: this.getMetadata(args, x),
    //     }, { parent: this });
    //   case 'StatefulSet':
    //     return new k8s.apps.v1.StatefulSet(this.getName(), {
    //       metadata: this.getMetadata(args, x),
    //     }, { parent: this });
    //   case 'DaemonSet':
    //     return new k8s.apps.v1.DaemonSet(this.getName(), {
    //       metadata: this.getMetadata(args, x),
    //     }, { parent: this });
    //   }
    // });

    if (args.service) {
      this.service = new k8s.core.v1.Service(this.getName(), {
        metadata: this.getMetadata(args, args.service),
        spec: pulumi.output(args.service).apply(s => ({
          ...s,
        })),
      }, { parent: this });
    }

    if (args.ingress) {
      this.ingress = new k8s.networking.v1.Ingress(this.getName(), {
        metadata: this.getMetadata(args, args.ingress),
        spec: pulumi.output(args.ingress).apply(i => ({
          // ...i,
          rules: this.service?.spec.ports.apply(ports => ports.map(port => ({
            
          }))),
        })),
      }, { parent: this });
    }
  }

  // private getWorkloadCreator(spec: GetWorkloadSpec<TWorkload>): CreateWorkload<TWorkload> {
  //   switch (spec.type) {
  //   case 'Deployment': return k8s.apps.v1.Deployment;
  //   case 'StatefulSet': return k8s.apps.v1.StatefulSet;
  //   case 'DaemonSet': return k8s.apps.v1.DaemonSet;
  //   }
  // }

  private createRules(): Output<k8s.types.input.networking.v1.IngressRule[]> {
    if (!this.service) return pulumi.output([]);

    return this.service.spec.ports
      .apply(ports => ports.map(port => (<k8s.types.input.networking.v1.IngressRule>{
        host: 'TODO',
        http: {},
      })));
  }

  private getMetadata(
    ns: Input<{ namespace: Input<string>; }>,
    n: Input<{ name?: Input<string>; }>,
  ): Output<k8s.types.input.meta.v1.ObjectMeta> {
    return pulumi.all([ns, n])
      .apply(([a, b]) => [a.namespace, b.name])
      .apply(([namespace, name]) => ({ namespace, name }));
  }

}

export type ContainerAppArgs<
  T extends WorkloadSpec = DeploymentSpec
  > = Args<T>;
