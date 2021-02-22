/* eslint-disable @typescript-eslint/no-explicit-any */
import * as pulumi from '@pulumi/pulumi';

beforeEach(() => {

  pulumi.runtime.setMocks({
    newResource: function (type: string, name: string, inputs: any): { id: string, state: any; } {
      return {
        id: inputs.name + '_id',
        state: inputs,
      };
    },
    call: function (token: string, args: any, provider?: string) {
      return args;
    },
  });

});
