import { Input } from '@pulumi/pulumi';
import { newAppFactory } from '../helm-app';
import {
  BitnamiArgs,
  Debuggable,
  Enableable,
  getAppArgs,
  GlobalArgs,
  ImageArgs,
  ObjectArgs,
} from './common';

export const chart = 'elasticsearch';
export const defaultVersion = '14.2.1';

export const newElasticSearch = newAppFactory<ElasticSearchArgs>(
  'elasticsearch',
  getAppArgs(chart, defaultVersion));

export interface ElasticSearchArgs extends BitnamiArgs {
  global?: Input<GlobalArgs & {
    coordinating?: Input<{
      name?: Input<string>;
    }>;
    kibanaEnabled?: Input<boolean>;
  }>;
  image?: Input<ImageArgs & Debuggable>;
  nameOverride?: Input<string>;
  sysctlImage?: Input<ImageArgs & Enableable>;

  /**
   * ElasticSearch cluster name.
   */
  name?: Input<string>;

  /**
   * Comma, semi-colon or space separated list of plugins to install at initialization.
   * ref: https://github.com/bitnami/bitnami-docker-elasticsearch#environment-variables
   */
  plugins?: Input<string>;

  /**
   * File System snapshot repository path.
   * ref: https://github.com/bitnami/bitnami-docker-elasticsearch#environment-variables
   */
  snapshotRepoPath?: Input<string>;

  /**
   * Customize elasticsearch configuration.
   * ref: https://www.elastic.co/guide/en/elasticsearch/reference/current/settings.html
   */
  config?: Input<string>;

  // TODO: Extra volume stuff

  /**
   * initdb scripts.
   * Specify dictionary of scripts to be run at first boot.
   * Alternatively, you can put your scripts under the files/docker-entrypoint-initdb.d directory.
   * For example:
   * initScripts:
   *   my_init_script.sh: |
   *      #!/bin/sh
   *      echo "Do something."
   */
  initScripts?: Input<Record<string, Input<string>>>;

  /**
   * ConfigMap with scripts to be run at first boot.
   * Note: This will override initScripts.
   */
  initScriptsCM?: Input<string>;

  /**
   * Secret with init scripts to execute (for sensitive data)
   */
  initScriptsSecret?: Input<string>;

  // TODO: Extra vars stuff

  master?: Input<ObjectArgs>;
}
