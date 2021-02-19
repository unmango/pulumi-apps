import { ComponentResourceOptions } from '@pulumi/pulumi';
import { AppBase } from './app-base';

export abstract class ContainerApp<TArgs extends ContainerAppArgs = ContainerAppArgs> extends AppBase {

  constructor(app: string, name: string, args: TArgs, opts?: ComponentResourceOptions) {
    super(app, name, opts);
  }

}

export interface ContainerAppArgs {
  image: string;
  tag: string;
}
