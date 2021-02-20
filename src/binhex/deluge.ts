import * as k8s from '@pulumi/kubernetes';
import { ComponentResourceOptions } from '@pulumi/pulumi';
import { Input } from '@pulumi/pulumi/output';
import { ContainerApp, ContainerAppArgs } from '../container-app';

export class Deluge extends ContainerApp {

  constructor(name: string, args: DelugeArgs, opts?: ComponentResourceOptions) {
    super('deluge', name, {
      image: '',
      ...args,
    }, opts);
  }

}

export interface DelugeArgs extends ContainerAppArgs {
  vpn: Input<string>;
}
