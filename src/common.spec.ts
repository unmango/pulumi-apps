/* eslint-disable @typescript-eslint/no-explicit-any */
import * as pulumi from '@pulumi/pulumi';

beforeEach(() => {

  pulumi.runtime.setMocks({
    newResource: ({ inputs }: pulumi.runtime.MockResourceArgs): { id: string, state: Record<string, any>; } => {
      return {
        id: inputs.name + '_id',
        state: inputs,
      };
    },
    call: ({ inputs }: pulumi.runtime.MockCallArgs): Record<string, any> => {
      return inputs;
    },
  });

});
