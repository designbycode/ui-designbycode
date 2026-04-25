export type RegistryType =
    | 'registry:lib'
    | 'registry:block'
    | 'registry:component'
    | 'registry:ui'
    | 'registry:hook'
    | 'registry:theme'
    | 'registry:page'
    | 'registry:file'
    | 'registry:style'
    | 'registry:base'
    | 'registry:font'
    | 'registry:item';

export type RegistryFile = {
    path: string;
    content: string;
    type: RegistryType;
    target?: string;
};

export type RegistryTailwind = {
    config?: {
        content?: string[];
        theme?: Record<string, unknown>;
        plugins?: string[];
    };
};

export type RegistryFont = {
    family: string;
    provider: 'google';
    import: string;
    variable: string;
    weight?: string[];
    subsets?: string[];
    selector?: string;
    dependency?: string;
};

export type RegistryCssVars = {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
};

export type RegistryCss = Record<string, unknown>;

export type RegistryMeta = {
    category?: string;
    version?: string;
};

export type RegistryProps = {
    id: number;
    name: string;
    type: RegistryType;
    title: string | null;
    description: string | null;
    author: string | null;
    dependencies: string[] | null;
    devDependencies: string[] | null;
    registryDependencies: string[] | null;
    files: RegistryFile[] | null;
    tailwind: RegistryTailwind | null;
    envVars: Record<string, string> | null;
    docs: string | null;
    categories: string[] | null;
    extends: string | null;
    style: string | null;
    iconLibrary: string | null;
    baseColor: string | null;
    theme: string | null;
    meta: RegistryMeta;
    font: RegistryFont | null;
    css_vars: RegistryCssVars | null;
    css: RegistryCss | null;
    created_at: string;
    updated_at: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginationMeta = {
    current_page: number;
    from: number | null;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
};

export type RegistriesProps = {
    registries: {
        data: RegistryProps[];
        meta: PaginationMeta;
    };
};
