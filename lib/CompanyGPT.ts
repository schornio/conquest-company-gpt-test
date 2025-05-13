export type CompanyGPTModel = {
  id: string;
  name: string;
};

export type CompanyGPTRole = {
  roleId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type CompanyGPTDataCollection = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CompanyGPTMedia = {
  title: string;
  uniqueTitle: string;
  mediaType: string;
  mediaSize: number;
  mediaPath: string;
  tokenSize: number;
  originalSize: number;
  url: string;
  baseUrl: string;
  createdAt: string;
};

export type CompanyGPTChunk = {
  content: string;
  pageNr: number;
};

export type CompanyGPTMessage = {
  content: string;
  role: 'user' | 'assistant' | 'system';
};

export type CompanyGPTChatMode = 'BASIC' | 'QA' | 'GOOGLE';

function getEnvVarOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export class CompanyGPT {
  #apiKey: string;
  #apiOrganizationId: string;
  #apiSubdomain: string;

  constructor(config?: {
    apiKey?: string;
    apiOrganizationId?: string;
    apiSubdomain?: string;
  }) {
    const apiKey = config?.apiKey ?? getEnvVarOrThrow('COMPANY_GPT_API_KEY');
    const apiOrganizationId =
      config?.apiOrganizationId ??
      getEnvVarOrThrow('COMPANY_GPT_API_ORGANIZATION_ID');
    const apiSubdomain =
      config?.apiSubdomain ?? getEnvVarOrThrow('COMPANY_GPT_API_SUBDOMAIN');

    this.#apiKey = apiKey;
    this.#apiOrganizationId = apiOrganizationId;
    this.#apiSubdomain = apiSubdomain;
  }

  #fetch = async (path: string, options?: RequestInit) => {
    const url = `https://${
      this.#apiSubdomain
    }.506.ai:3003/api/v1/public/${path}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'api-key': this.#apiKey,
        'api-organization-id': this.#apiOrganizationId,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
      );
    }

    return response;
  };

  async getModels() {
    const response = await this.#fetch('models');
    const body = await response.json();
    return body as CompanyGPTModel[];
  }

  async getRoles() {
    const response = await this.#fetch('roles');
    const body = await response.json();
    return body as CompanyGPTRole[];
  }

  async getDataCollections() {
    const response = await this.#fetch('dataCollections');
    const body = await response.json();
    return body as CompanyGPTDataCollection[];
  }

  async getMediaByDataCollection(
    dataCollectionId: string,
    query?: { pageNumber?: number; pageSize?: number },
  ) {
    const searchParams = new URLSearchParams();
    if (query?.pageNumber) {
      searchParams.append('pageNumber', query.pageNumber.toString());
    }

    if (query?.pageSize) {
      searchParams.append('pageSize', query.pageSize.toString());
    }

    const response = await this.#fetch(
      `mediaByDataCollection/${dataCollectionId}?${searchParams.toString()}`,
    );
    const body = await response.json();
    return body as {
      pageNumber: number;
      totalPages: number;
      pageSize: number;
      totalElements: number;
      media: CompanyGPTMedia[];
    };
  }

  async getChunk(uniqueTitle: string, chunkNr: number) {
    const searchParams = new URLSearchParams();
    searchParams.append('uniqueTitle', uniqueTitle);
    searchParams.append('chunkNr', chunkNr.toString());

    const response = await this.#fetch(`chunk?${searchParams.toString()}`);
    const body = await response.json();
    return body as CompanyGPTChunk;
  }

  async *chat(request: {
    model: {
      id: string;
    };
    messages: CompanyGPTMessage[];
    roleId?: string;
    temperature?: number;
    selectedMode: CompanyGPTChatMode;
    selectedFiles?: string[];
    selectedDataCollections?: string[];
  }) {
    const requestComplete = {
      ...request,
      roleId: request.roleId ?? '',
      selectedDataCollections: request.selectedDataCollections ?? [],
      temperature: request.temperature ?? 0.2,
    };

    const response = await this.#fetch('chat', {
      body: JSON.stringify(requestComplete),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.body) {
      throw new Error('Response body is missing');
    }

    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const decodedChunk = decoder.decode(value);
      const sanitizedChunk = decodedChunk.replace(/^data:/gmu, '');
      yield sanitizedChunk;
    }
  }
}
