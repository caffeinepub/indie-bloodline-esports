// Auto-generated backend interface stub
// This file is replaced during production build by the actual Motoko canister bindings

import type { Identity } from "@icp-sdk/core/agent";

export type CreateActorOptions = {
  agentOptions?: {
    identity?: Identity | Promise<Identity>;
    host?: string;
    [key: string]: unknown;
  };
  actorOptions?: {
    canisterId?: string;
    [key: string]: unknown;
  };
};

export class ExternalBlob {
  constructor(public url: string, public headers?: [string, string][]) {}

  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(url);
  }

  async getBytes(): Promise<Uint8Array> {
    const response = await fetch(this.url);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }

  onProgress?: (progress: number) => void;
}

export type backendInterface = {
  _initializeAccessControlWithSecret(secret: string): Promise<void>;
};

export function createActor(
  canisterId: string,
  uploadFn: (blob: ExternalBlob) => Promise<Uint8Array>,
  downloadFn: (bytes: Uint8Array) => Promise<ExternalBlob>,
  options?: CreateActorOptions,
): backendInterface {
  console.warn("Backend stub: createActor called", { canisterId, options });
  return {
    _initializeAccessControlWithSecret: async (_secret: string) => {},
  };
}
