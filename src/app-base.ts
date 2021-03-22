import { ComponentResource, ComponentResourceOptions } from '@pulumi/pulumi';
import { getNameResolver } from './util';

export type AppConstructor<T, U extends AppBase = AppBase> = {
  new(name: string, args: T, opts?: ComponentResourceOptions): U;
}

export type AppConstructorParameters<T> = ConstructorParameters<AppConstructor<T>>;

export abstract class AppBase extends ComponentResource {

  protected readonly getName = getNameResolver(this.appName, this.name);

  constructor(private appName: string, private name: string, opts?: ComponentResourceOptions) {
    super(`unmango:apps:${appName}`, name, undefined, opts);
  }

}
