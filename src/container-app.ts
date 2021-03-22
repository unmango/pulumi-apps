import * as k8s from '@pulumi/kubernetes';
import * as input from '@pulumi/kubernetes/types/input';
import { ComponentResourceOptions, Input, Output } from '@pulumi/pulumi';
import * as pulumi from '@pulumi/pulumi';
import { AppBase } from './app-base';

// type WorkloadDiscriminator = {
//   type: 'Deployment' | 'StatefulSet' | 'DaemonSet';
// };

// type CreateWorkload<T extends Workload> = {
//   new(name: string, args?: GetWorkloadArgs<T>, opts?: CustomResourceOptions): T;
// };

interface Name { name?: Input<string> }
type DeploymentSpec = input.apps.v1.DeploymentSpec & Name;
type StatefulSetSpec = input.apps.v1.StatefulSetSpec & Name;
type DaemonSetSpec = input.apps.v1.DaemonSetSpec & Name;

interface BaseArgs {
  method: 'deployment' | 'statefulset' | 'daemonset';
  namespace: Input<string>;
  workload: Input<DeploymentSpec | StatefulSetSpec | DaemonSetSpec>;
  service?: Input<k8s.types.input.core.v1.ServiceSpec & Name>;
  ingress?: Input<k8s.types.input.networking.v1.IngressSpec & Name>;
}

interface DeploymentArgs extends BaseArgs {
  method: 'deployment';
  workload: Input<DeploymentSpec>;
}

interface StatefulSetArgs extends BaseArgs {
  method: 'statefulset';
  workload: Input<StatefulSetSpec>;
}

interface DaemonSetArgs extends BaseArgs {
  method: 'daemonset';
  workload: Input<DaemonSetSpec>;
}

type Args =
  | DeploymentArgs
  | StatefulSetArgs
  | DaemonSetArgs;

// type GetWorkload<T extends Args> =
//   T extends DeploymentArgs ? k8s.apps.v1.Deployment :
//   T extends StatefulSetArgs ? k8s.apps.v1.StatefulSet :
//   T extends DaemonSetArgs ? k8s.apps.v1.DaemonSet :
//   never;

export class ContainerApp extends AppBase {

  // public readonly workload: GetWorkload<T>;
  public readonly deployment?: k8s.apps.v1.Deployment;
  public readonly statefulSet?: k8s.apps.v1.StatefulSet;
  public readonly daemonSet?: k8s.apps.v1.DaemonSet;
  public readonly service?: k8s.core.v1.Service;
  public readonly ingress?: k8s.networking.v1.Ingress;

  constructor(app: string, name: string, args: Args, opts?: ComponentResourceOptions) {
    super(app, name, opts);

    switch (args.method) {
      case 'deployment':
        this.deployment = new k8s.apps.v1.Deployment(this.getName(), {
          metadata: this.getMetadata(args, args.workload),
          spec: args.workload,
        }, { parent: this });
        break;
      case 'statefulset':
        this.statefulSet = new k8s.apps.v1.StatefulSet(this.getName(), {
          metadata: this.getMetadata(args, args.workload),
          spec: args.workload,
        }, { parent: this });
        break;
      case 'daemonset':
        this.daemonSet = new k8s.apps.v1.DaemonSet(this.getName(), {
          metadata: this.getMetadata(args, args.workload),
          spec: args.workload,
        });
        break;
    }

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
          ...i,
          // rules: this.service?.spec.ports.apply(ports => ports.map(port => ({

          // }))),
        })),
      }, { parent: this });
    }
  }

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
  ): Output<input.meta.v1.ObjectMeta> {
    return pulumi.all([ns, n])
      .apply(([a, b]) => [a.namespace, b.name])
      .apply(([namespace, name]) => ({ namespace, name }));
  }

}

export type ContainerAppArgs = Args;
