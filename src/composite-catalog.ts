import { ComponentResource, ComponentResourceOptions } from '@pulumi/pulumi';
import { Catalog, CatalogArgs, CatalogV2, CatalogV2Args } from '@pulumi/rancher2';
import { getNameResolver } from './util';

export class CompositeCatalog extends ComponentResource {

  private readonly getName = getNameResolver('catalogs', this.name);

  public readonly catalog: Catalog;
  public readonly catalogV2: CatalogV2;

  constructor(private name: string, args: CompositeCatalogArgs, opts?: ComponentResourceOptions) {
    super('unmango:apps:catalog', name, undefined, opts);

    const a = { ...args, version: 'helm_v3' };
    this.catalog = new Catalog(this.getName(), a, { parent: this });
    this.catalogV2 = new CatalogV2(this.getName(), a, { parent: this });

    this.registerOutputs();
  }

}

export type CompositeCatalogArgs = Omit<
  CatalogArgs & CatalogV2Args
  & Required<Pick<CatalogV2Args, 'clusterId'>>
  , 'version'>;
