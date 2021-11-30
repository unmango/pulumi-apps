// *** WARNING: this file was generated by crd2pulumi. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import { input as inputs, output as outputs } from "../../types";
import * as utilities from "../../utilities";

import {ObjectMeta} from "../../meta/v1";

/**
 * A ClusterIssuer represents a certificate issuing authority which can be referenced as part of `issuerRef` fields. It is similar to an Issuer, however it is cluster-scoped and therefore can be referenced by resources that exist in *any* namespace, not just the same namespace as the referent.
 */
export class ClusterIssuer extends pulumi.CustomResource {
    /**
     * Get an existing ClusterIssuer resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    public static get(name: string, id: pulumi.Input<pulumi.ID>, opts?: pulumi.CustomResourceOptions): ClusterIssuer {
        return new ClusterIssuer(name, undefined as any, { ...opts, id: id });
    }

    /** @internal */
    public static readonly __pulumiType = 'kubernetes:cert-manager.io/v1alpha3:ClusterIssuer';

    /**
     * Returns true if the given object is an instance of ClusterIssuer.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is ClusterIssuer {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === ClusterIssuer.__pulumiType;
    }

    public readonly apiVersion!: pulumi.Output<"cert-manager.io/v1alpha3" | undefined>;
    public readonly kind!: pulumi.Output<"ClusterIssuer" | undefined>;
    public readonly metadata!: pulumi.Output<ObjectMeta | undefined>;
    /**
     * Desired state of the ClusterIssuer resource.
     */
    public readonly spec!: pulumi.Output<outputs.certmanager.v1alpha3.ClusterIssuerSpec | undefined>;
    /**
     * Status of the ClusterIssuer. This is set and managed automatically.
     */
    public readonly status!: pulumi.Output<outputs.certmanager.v1alpha3.ClusterIssuerStatus | undefined>;

    /**
     * Create a ClusterIssuer resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: ClusterIssuerArgs, opts?: pulumi.CustomResourceOptions) {
        let inputs: pulumi.Inputs = {};
        opts = opts || {};
        if (!opts.id) {
            inputs["apiVersion"] = "cert-manager.io/v1alpha3";
            inputs["kind"] = "ClusterIssuer";
            inputs["metadata"] = args ? args.metadata : undefined;
            inputs["spec"] = args ? args.spec : undefined;
            inputs["status"] = args ? args.status : undefined;
        } else {
            inputs["apiVersion"] = undefined /*out*/;
            inputs["kind"] = undefined /*out*/;
            inputs["metadata"] = undefined /*out*/;
            inputs["spec"] = undefined /*out*/;
            inputs["status"] = undefined /*out*/;
        }
        if (!opts.version) {
            opts = pulumi.mergeOptions(opts, { version: utilities.getVersion()});
        }
        super(ClusterIssuer.__pulumiType, name, inputs, opts);
    }
}

/**
 * The set of arguments for constructing a ClusterIssuer resource.
 */
export interface ClusterIssuerArgs {
    readonly apiVersion?: pulumi.Input<"cert-manager.io/v1alpha3">;
    readonly kind?: pulumi.Input<"ClusterIssuer">;
    readonly metadata?: pulumi.Input<ObjectMeta>;
    /**
     * Desired state of the ClusterIssuer resource.
     */
    readonly spec?: pulumi.Input<inputs.certmanager.v1alpha3.ClusterIssuerSpecArgs>;
    /**
     * Status of the ClusterIssuer. This is set and managed automatically.
     */
    readonly status?: pulumi.Input<inputs.certmanager.v1alpha3.ClusterIssuerStatusArgs>;
}
