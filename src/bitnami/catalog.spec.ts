import * as pulumi from '@pulumi/pulumi';
import { BitnamiCatalog } from './catalog';

describe('BitnamiCatalog', () => {
  const expectedClusterId = 'test-cluster-id';
  let catalog: BitnamiCatalog;

  beforeEach(() => {
    catalog = new BitnamiCatalog('test', {
      clusterId: expectedClusterId,
    });
  });

  it('should set clusterId on catalog V2', (done) => {
    pulumi.all([catalog.catalogV2.clusterId]).apply(([clusterId]) => {
      if(clusterId !== expectedClusterId) {
        done(new Error('Invalid clusterId'));
      } else {
        done();
      }
    });
  });

  it('should set clusterId on catalog', (done) => {
    pulumi.all([catalog.catalog.clusterId]).apply(([clusterId]) => {
      if(clusterId !== expectedClusterId) {
        done(new Error('Invalid clusterId'));
      } else {
        done();
      }
    });
  });

  it('should set url on catalog V2', (done) => {
    pulumi.all([catalog.catalogV2.url]).apply(([url]) => {
      if(url !== BitnamiCatalog.url) {
        done(new Error('Invalid url'));
      } else {
        done();
      }
    });
  });

  it('should set url on catalog', (done) => {
    pulumi.all([catalog.catalog.url]).apply(([url]) => {
      if(url !== BitnamiCatalog.url) {
        done(new Error('Invalid url'));
      } else {
        done();
      }
    });
  });

  it('should set name on catalog V2', (done) => {
    pulumi.all([catalog.catalogV2.name]).apply(([name]) => {
      if(name !== BitnamiCatalog.catalogName) {
        done(new Error('Invalid name'));
      } else {
        done();
      }
    });
  });

  it('should set name on catalog', (done) => {
    pulumi.all([catalog.catalog.name]).apply(([name]) => {
      if(name !== BitnamiCatalog.catalogName) {
        done(new Error('Invalid name'));
      } else {
        done();
      }
    });
  });

  it('should allow overriding name on catalog V2', (done) => {
    const expectedName = 'owverwritten';
    const overwritten = new BitnamiCatalog('test', {
      clusterId: expectedClusterId,
      name: expectedName,
    });

    pulumi.all([overwritten.catalogV2.name]).apply(([name]) => {
      if(name !== expectedName) {
        done(new Error('Did not overwrite name'));
      } else {
        done();
      }
    });
  });

  it('should allow overriding name on catalog', (done) => {
    const expectedName = 'owverwritten';
    const overwritten = new BitnamiCatalog('test', {
      clusterId: expectedClusterId,
      name: expectedName,
    });

    pulumi.all([overwritten.catalog.name]).apply(([name]) => {
      if(name !== expectedName) {
        done(new Error('Did not overwrite name'));
      } else {
        done();
      }
    });
  });

});
