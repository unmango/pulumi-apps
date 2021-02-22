import { Input, Inputs } from '@pulumi/pulumi';
import { ChartArgs } from '../helm-app';
import { InputArray } from '../input';
import { ExternalTrafficPolicy, AffinityType, PullPolicy, ServiceType } from '../types';
import { BitnamiCatalog } from './catalog';

interface GlobalArgs {
  /**
   * Global Docker image registry
   */
  imageRegistry?: Input<string>;

  /**
   * Global Docker registry secret names as an array
   */
  imagePullSecrets?: InputArray<string>;

  /**
   * Global storage class for dynamic provisioning
   */
  storageClass?: Input<string>;
}

export interface ServiceArgs {
  type?: Input<ServiceType>;
  port?: Input<string>;
  httpsPort?: Input<string>;
  nodePorts?: Input<{
    http?: Input<string>;
    https?: Input<string>;
  }>;
  externalTrafficPolicy?: Input<ExternalTrafficPolicy>;
}

export interface ImageArgs {
  registry?: Input<string>;
  repository?: Input<string>;
  tag?: Input<string>;
  pullPolicy?: Input<PullPolicy>;
  pullSecrets?: InputArray<string>;
}

export interface ProbeArgs {
  enabled?: Input<boolean>;
  // TODO: httpGet || command || etc
  initialDelaySeconds?: Input<string>;
  periodSeconds?: Input<string>;
  timeoutSeconds?: Input<string>;
  failureThreshold?: Input<string>;
  successThreshold?: Input<string>;
}

export interface ResourcesArgs {
  limits?: Input<{
    cpu?: Input<string>;
    memory?: Input<string>;
  }>;
  requests?: Input<{
    cpu?: Input<string>;
    memory?: Input<string>;
  }>;
}

export interface ContainerSecurityContextArgs {
  enabled: Input<boolean>;
  runAsUser?: Input<number>;
  runAsNonRoot?: Input<boolean>;
}

export interface PodSecurityContextArgs {
  enabled?: Input<boolean>;
  fsGroup?: Input<number>;
}

export interface AffinityPresetArgs {
  type?: Input<AffinityType>;

  /**
   * Node label key to match.
   */
  key?: Input<string>;

  /**
   * Node label values to match.
   */
  values?: InputArray<string>;
}

export interface ContainerArgs {
  name?: Input<string>;
  image?: Input<string>;
  imagePullPolicy?: Input<PullPolicy>;
  ports?: InputArray<{
    name?: Input<string>;
    containerPort?: Input<number>;
  }>;
}

export interface ObjectArgs {
  enabled?: Input<boolean>;
  image?: Input<ImageArgs>;

  /**
   * Extra options for liveness probe.
   */
  livenessProbe?: Input<ProbeArgs>;

  /**
   * Extra options for readiness probe.
   */
  readinessProbe?: Input<ProbeArgs>;

  /**
   * ConfigMap with main container configuration.
   */
  existingConfigMap?: Input<string>;

  command?: InputArray<string>;
  args?: InputArray<string>;

  /**
   * Deployment pod host aliases.
   */
  hostAliases?: InputArray<string>;

  /**
   * Main container resource requests and limits.
   */
  resources?: Input<ResourcesArgs>;

  /**
   * Main container's security context.
   */
  containerSecurityContext?: Input<ContainerSecurityContextArgs>;

  /**
   * Main pod's security context.
   */
  podSecurityContext?: Input<PodSecurityContextArgs>;

  podAffinityPreset?: Input<AffinityType>;
  podAntiAffinityPreset?: Input<AffinityType>;
  nodeAffinityPreset?: Input<AffinityPresetArgs>;

  /**
   * Affinity for pod assignment. Evaluated as a template.
   */
  affinity?: Inputs;

  /**
   * Node labels for pod assignment. Evaluated as a template.
   */
  nodeSelector?: Inputs;

  /**
   * Tolerations for pod assignment. Evaluated as a template.
   */
  tolerations?: Inputs[];

  podLabels?: Inputs;
  podAnnotations?: Inputs;

  /**
   * Main pod's priority.
   */
  priorityClassName?: Input<string>;

  /**
   * Lifecycle hooks for the main container to automate configuration before or after startup.
   */
  lifecycleHooks?: Inputs;

  customLivenessProbe?: Inputs;
  customReadinessProbe?: Inputs;

  updateStrategy?: Input<{
    type: Input<'RollingUpdate' | 'Recreate'>;
  }>;

  extraEnvVars?: InputArray<{
    name: Input<string>;
    value: Input<string>;
  }>;

  /**
   * ConfigMap with extra environment variables.
   */
  extraEnvVarsCM?: Input<string>;

  /**
   * Secret with extra environment variables.
   */
  extraEnvVarsSecret?: Input<string>;

  /**
   * TODO: type this
   * Extra volumes to add to the deployment.
   */
  extraVolumes?: Inputs[];

  /**
   * TODO: type this
   * Extra volume mounts to add to the container.
   */
  extraVolumeMounts?: Inputs[];

  initContainers?: InputArray<ContainerArgs>;
  sidecars?: InputArray<ContainerArgs>;
}

export interface VolumePermissionsArgs {
  enabled?: Input<boolean>;
  image?: Input<ImageArgs>;
  resources?: Input<ResourcesArgs>;
}

export interface RbacArgs {
  create?: Input<boolean>;
}

export interface ServiceAccountArgs {
  create?: Input<boolean>;

  /**
   * If not set and create is set to true, a name is generated using the fullName template.
   */
  name?: Input<string>;
}

export interface CommonArgs {
  global?: GlobalArgs;

  /**
   * Add labels to all the deployed resources.
   */
  commonLabels?: Inputs;

  /**
   * Add annotations to all the deployed resources.
   */
  commonAnnotations?: Inputs;

  /**
   * Kubernetes cluster domain.
   */
  clusterDomain?: Input<string>;

  /**
   * Extra objects to deploy (value evaluated as a template).
   */
  extraDeploy?: InputArray<string>;

  /**
   * Number of nodes.
   */
  replicaCount?: Input<number>;

  service?: Input<ServiceArgs>;

  /**
   * Init container parameters
   */
  volumePermissions?: Input<VolumePermissionsArgs>;

  rbac?: Input<RbacArgs>;
  serviceAccount?: Input<ServiceAccountArgs>;
}

export type BitnamiArgs<
  T extends string = never,
  V extends ObjectArgs = ObjectArgs,
  > = CommonArgs & {
    [P in T]: V;
  };

export const getAppArgs = (chart: string, version: string): ChartArgs => ({
  repo: BitnamiCatalog.catalogName,
  repoUrl: BitnamiCatalog.url,
  chart,
  version,
});
