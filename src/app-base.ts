import { ComponentResource, ComponentResourceOptions } from '@pulumi/pulumi';
import { getNameResolver } from './util';

export type AppConstructor<T extends AppBase, U> = {
  new(name: string, args: U, opts?: ComponentResourceOptions): T;
}

export type AppConstructorParameters<T extends AppBase, U> = ConstructorParameters<AppConstructor<T, U>>;

export abstract class AppBase extends ComponentResource {

  protected readonly getName = getNameResolver(this.app, this.name);

  constructor(private app: string, private name: string, opts?: ComponentResourceOptions) {
    super(`unmango:apps:${app}`, name, undefined, opts);
  }

}
