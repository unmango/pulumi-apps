import * as pulumi from '@pulumi/pulumi';
import { Input, Output } from '@pulumi/pulumi';
import * as yaml from 'yaml';

export function getNameResolver(baseName: string, resourceName: string): (name?: string) => string {
  return (name?: string) => {
    return [...new Set([baseName, resourceName, name])]
      .filter(x => !!x)
      .join('-');
  };
}

export function toYaml(obj: Input<Record<string, Input<unknown>>>): Output<string> {
  return pulumi.output(obj).apply(yaml.stringify);
}
