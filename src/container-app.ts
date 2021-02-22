import * as k8s from '@pulumi/kubernetes';
import { ComponentResourceOptions, Input, Output } from '@pulumi/pulumi';
import * as pulumi from '@pulumi/pulumi';
import { AppBase } from './app-base';

type WorkloadDiscriminator = {
  type: 'Deployment' | 'StatefulSet' | 'DaemonSet';
};

// type CreateWorkload<T extends Workload> = {
//   new(name: string, args?: GetWorkloadArgs<T>, opts?: CustomResourceOptions): T;
// };

interface BaseArgs {
  method: 'deployment' | 'statefulset' | 'daemonset';
  namespace: Input<string>;
  service?: Input<k8s.types.input.core.v1.ServiceSpec & {
    name?: Input<string>;
  }>;
  ingress?: Input<k8s.types.input.networking.v1.IngressSpec & {
    name?: Input<string>;
  }>;
}

interface DeploymentArgs extends BaseArgs {
  method: 'deployment';
  workload: Input<k8s.types.input.apps.v1.DeploymentSpec & {
    name?: Input<string>;
  }>;
}

interface StatefulSetArgs extends BaseArgs {
  method: 'statefulset';
  workload: Input<k8s.types.input.apps.v1.StatefulSetSpec & {
    name?: Input<string>;
  }>;
}

interface DaemonSetArgs extends BaseArgs {
  method: 'daemonset';
  workload: Input<k8s.types.input.apps.v1.DaemonSetSpec & {
    name?: Input<string>;
  }>;
}

type Args =
  | DeploymentArgs
  | StatefulSetArgs
  | DaemonSetArgs;

type GetWorkload<T extends Args> =
  T extends DeploymentArgs ? k8s.apps.v1.Deployment :
  T extends StatefulSetArgs ? k8s.apps.v1.StatefulSet :
  T extends DaemonSetArgs ? k8s.apps.v1.DaemonSet :
  never;

export class ContainerApp<T extends Args> extends AppBase {

  public readonly workload: GetWorkload<T>;
  public readonly service?: k8s.core.v1.Service;
  public readonly ingress?: k8s.networking.v1.Ingress;

  constructor(app: string, name: string, args: T, opts?: ComponentResourceOptions) {
    super(app, name, opts);

    switch (args.method) {
    case 'deployment':
      this.workload = new k8s.apps.v1.Deployment(this.getName());
      break;
    case 'statefulset':
      this.workload = new k8s.apps.v1.StatefulSet(this.getName());
      break;
    case 'daemonset':
      this.workload = new k8s.apps.v1.DaemonSet(this.getName());
      break;
    }

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

  private getWorkload(args: T): GetWorkload<T> {
    switch (args.method) {
    case 'deployment':
      return new k8s.apps.v1.Deployment(this.getName());
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

export type ContainerAppArgs = Args;

const temp = new ContainerApp('', '', {
  method: 'deployment',
  
});
