import { CustomResourceOptions } from '@pulumi/pulumi';
import { CompositeCatalog, CompositeCatalogArgs } from '../composite-catalog';

type Args = Omit<CompositeCatalogArgs, 'url'>;

export class BitnamiCatalog extends CompositeCatalog {

  public static readonly url = 'https://charts.bitnami.com/bitnami';
  public static readonly catalogName = 'bitnami';

  constructor(name: string, args: Args, opts?: CustomResourceOptions) {
    super(name, {
      ...args,
      url: BitnamiCatalog.url,
      name: args.name ?? BitnamiCatalog.catalogName,
    }, opts);
  }

}
