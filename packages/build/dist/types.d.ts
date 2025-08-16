import { z } from "zod";
declare const viewsContainerSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    icon: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    icon: string;
}, {
    id: string;
    title: string;
    icon: string;
}>, "many">>;
export type ViewsContainer = z.infer<typeof viewsContainerSchema>;
declare const viewsSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    type: z.ZodString;
    id: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: string;
    id: string;
    name: string;
}, {
    type: string;
    id: string;
    name: string;
}>, "many">>;
export type Views = z.infer<typeof viewsSchema>;
declare const commandsSchema: z.ZodArray<z.ZodObject<{
    command: z.ZodString;
    title: z.ZodString;
    category: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    command: string;
    icon?: string | undefined;
    category?: string | undefined;
}, {
    title: string;
    command: string;
    icon?: string | undefined;
    category?: string | undefined;
}>, "many">;
export type Commands = z.infer<typeof commandsSchema>;
declare const menuItemSchema: z.ZodObject<{
    group: z.ZodString;
    command: z.ZodOptional<z.ZodString>;
    submenu: z.ZodOptional<z.ZodString>;
    when: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    group: string;
    command?: string | undefined;
    submenu?: string | undefined;
    when?: string | undefined;
}, {
    group: string;
    command?: string | undefined;
    submenu?: string | undefined;
    when?: string | undefined;
}>;
export type MenuItem = z.infer<typeof menuItemSchema>;
declare const menusSchema: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
    group: z.ZodString;
    command: z.ZodOptional<z.ZodString>;
    submenu: z.ZodOptional<z.ZodString>;
    when: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    group: string;
    command?: string | undefined;
    submenu?: string | undefined;
    when?: string | undefined;
}, {
    group: string;
    command?: string | undefined;
    submenu?: string | undefined;
    when?: string | undefined;
}>, "many">>;
export type Menus = z.infer<typeof menusSchema>;
declare const submenusSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    label: string;
}, {
    id: string;
    label: string;
}>, "many">;
export type Submenus = z.infer<typeof submenusSchema>;
declare const configurationPropertySchema: z.ZodObject<{
    type: z.ZodUnion<[z.ZodLiteral<"string">, z.ZodLiteral<"array">, z.ZodLiteral<"object">, z.ZodLiteral<"boolean">, z.ZodLiteral<"number">]>;
    items: z.ZodOptional<z.ZodObject<{
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
    }, {
        type: string;
    }>>;
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    default: z.ZodOptional<z.ZodAny>;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "string" | "number" | "boolean" | "object" | "array";
    description: string;
    items?: {
        type: string;
    } | undefined;
    properties?: Record<string, any> | undefined;
    default?: any;
}, {
    type: "string" | "number" | "boolean" | "object" | "array";
    description: string;
    items?: {
        type: string;
    } | undefined;
    properties?: Record<string, any> | undefined;
    default?: any;
}>;
export type ConfigurationProperty = z.infer<typeof configurationPropertySchema>;
declare const configurationSchema: z.ZodObject<{
    title: z.ZodString;
    properties: z.ZodRecord<z.ZodString, z.ZodObject<{
        type: z.ZodUnion<[z.ZodLiteral<"string">, z.ZodLiteral<"array">, z.ZodLiteral<"object">, z.ZodLiteral<"boolean">, z.ZodLiteral<"number">]>;
        items: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: string;
        }, {
            type: string;
        }>>;
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        default: z.ZodOptional<z.ZodAny>;
        description: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "string" | "number" | "boolean" | "object" | "array";
        description: string;
        items?: {
            type: string;
        } | undefined;
        properties?: Record<string, any> | undefined;
        default?: any;
    }, {
        type: "string" | "number" | "boolean" | "object" | "array";
        description: string;
        items?: {
            type: string;
        } | undefined;
        properties?: Record<string, any> | undefined;
        default?: any;
    }>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    properties: Record<string, {
        type: "string" | "number" | "boolean" | "object" | "array";
        description: string;
        items?: {
            type: string;
        } | undefined;
        properties?: Record<string, any> | undefined;
        default?: any;
    }>;
}, {
    title: string;
    properties: Record<string, {
        type: "string" | "number" | "boolean" | "object" | "array";
        description: string;
        items?: {
            type: string;
        } | undefined;
        properties?: Record<string, any> | undefined;
        default?: any;
    }>;
}>;
export type Configuration = z.infer<typeof configurationSchema>;
export declare const contributesSchema: z.ZodObject<{
    viewsContainers: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        icon: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        icon: string;
    }, {
        id: string;
        title: string;
        icon: string;
    }>, "many">>;
    views: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        id: z.ZodString;
        name: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        id: string;
        name: string;
    }, {
        type: string;
        id: string;
        name: string;
    }>, "many">>;
    commands: z.ZodArray<z.ZodObject<{
        command: z.ZodString;
        title: z.ZodString;
        category: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        command: string;
        icon?: string | undefined;
        category?: string | undefined;
    }, {
        title: string;
        command: string;
        icon?: string | undefined;
        category?: string | undefined;
    }>, "many">;
    menus: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodObject<{
        group: z.ZodString;
        command: z.ZodOptional<z.ZodString>;
        submenu: z.ZodOptional<z.ZodString>;
        when: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        group: string;
        command?: string | undefined;
        submenu?: string | undefined;
        when?: string | undefined;
    }, {
        group: string;
        command?: string | undefined;
        submenu?: string | undefined;
        when?: string | undefined;
    }>, "many">>;
    submenus: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
    }, {
        id: string;
        label: string;
    }>, "many">;
    configuration: z.ZodObject<{
        title: z.ZodString;
        properties: z.ZodRecord<z.ZodString, z.ZodObject<{
            type: z.ZodUnion<[z.ZodLiteral<"string">, z.ZodLiteral<"array">, z.ZodLiteral<"object">, z.ZodLiteral<"boolean">, z.ZodLiteral<"number">]>;
            items: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: string;
            }, {
                type: string;
            }>>;
            properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            default: z.ZodOptional<z.ZodAny>;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "string" | "number" | "boolean" | "object" | "array";
            description: string;
            items?: {
                type: string;
            } | undefined;
            properties?: Record<string, any> | undefined;
            default?: any;
        }, {
            type: "string" | "number" | "boolean" | "object" | "array";
            description: string;
            items?: {
                type: string;
            } | undefined;
            properties?: Record<string, any> | undefined;
            default?: any;
        }>>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        properties: Record<string, {
            type: "string" | "number" | "boolean" | "object" | "array";
            description: string;
            items?: {
                type: string;
            } | undefined;
            properties?: Record<string, any> | undefined;
            default?: any;
        }>;
    }, {
        title: string;
        properties: Record<string, {
            type: "string" | "number" | "boolean" | "object" | "array";
            description: string;
            items?: {
                type: string;
            } | undefined;
            properties?: Record<string, any> | undefined;
            default?: any;
        }>;
    }>;
}, "strip", z.ZodTypeAny, {
    viewsContainers: Record<string, {
        id: string;
        title: string;
        icon: string;
    }[]>;
    views: Record<string, {
        type: string;
        id: string;
        name: string;
    }[]>;
    commands: {
        title: string;
        command: string;
        icon?: string | undefined;
        category?: string | undefined;
    }[];
    menus: Record<string, {
        group: string;
        command?: string | undefined;
        submenu?: string | undefined;
        when?: string | undefined;
    }[]>;
    submenus: {
        id: string;
        label: string;
    }[];
    configuration: {
        title: string;
        properties: Record<string, {
            type: "string" | "number" | "boolean" | "object" | "array";
            description: string;
            items?: {
                type: string;
            } | undefined;
            properties?: Record<string, any> | undefined;
            default?: any;
        }>;
    };
}, {
    viewsContainers: Record<string, {
        id: string;
        title: string;
        icon: string;
    }[]>;
    views: Record<string, {
        type: string;
        id: string;
        name: string;
    }[]>;
    commands: {
        title: string;
        command: string;
        icon?: string | undefined;
        category?: string | undefined;
    }[];
    menus: Record<string, {
        group: string;
        command?: string | undefined;
        submenu?: string | undefined;
        when?: string | undefined;
    }[]>;
    submenus: {
        id: string;
        label: string;
    }[];
    configuration: {
        title: string;
        properties: Record<string, {
            type: "string" | "number" | "boolean" | "object" | "array";
            description: string;
            items?: {
                type: string;
            } | undefined;
            properties?: Record<string, any> | undefined;
            default?: any;
        }>;
    };
}>;
export type Contributes = z.infer<typeof contributesSchema>;
export {};
//# sourceMappingURL=types.d.ts.map