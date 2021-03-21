import { ComponentResource, ComponentResourceOptions } from '@pulumi/pulumi';
import { getNameResolver } from './util';

export type AppConstructor<T extends AppBase, U> = {
  new(name: string, args: U, opts?: ComponentResourceOptions): T;
}

export type AppConstructorParameters<T extends AppBase, U> = ConstructorParameters<AppConstructor<T, U>>;

export abstract class AppBase extends ComponentResource {

  protected readonly getName = getNameResolver(this.appName, this.name);

  constructor(private appName: string, private name: string, opts?: ComponentResourceOptions) {
    super(`unmango:apps:${appName}`, name, undefined, opts);
  }

}
