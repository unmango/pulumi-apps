import * as pulumi from '@pulumi/pulumi';
import { expect } from 'chai';
import { CompositeCatalog } from './composite-catalog';

describe('CompositeCatalog', () => {
  const expectedClusterId = 'test-cluster-id';
  const expectedUrl = 'test-url';
  let catalog: CompositeCatalog;

  beforeEach(() => {
    catalog = new CompositeCatalog('test', {
      clusterId: expectedClusterId,
      url: expectedUrl,
    });
  });

  it('should create catalog', () => {
    expect(catalog.catalog).to.exist;
  });

  it('should create catalog V2', () => {
    expect(catalog.catalogV2).to.exist;
  });

  it('should set version', (done) => {
    pulumi.all([catalog.catalog.version]).apply(([version]) => {
      if (version === 'helm_v3') {
        done();
      } else {
        done(new Error('Invalid catalog version'));
      }
    });
  });

  it('should set clusterId on catalog V2', (done) => {
    pulumi.all([catalog.catalogV2.clusterId]).apply(([clusterId]) => {
      if (clusterId !== expectedClusterId) {
        done(new Error('Invalid clusterId'));
      } else {
        done();
      }
    });
  });

  it('should set url on catalog V2', (done) => {
    pulumi.all([catalog.catalogV2.url]).apply(([url]) => {
      if (url !== expectedUrl) {
        done(new Error('Invalid url'));
      } else {
        done();
      }
    });
  });

  it('should set url on catalog', (done) => {
    pulumi.all([catalog.catalog.url]).apply(([url]) => {
      if (url !== expectedUrl) {
        done(new Error('Invalid url'));
      } else {
        done();
      }
    });
  });

});
