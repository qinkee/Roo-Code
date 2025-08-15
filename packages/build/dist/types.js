import { z } from "zod"
const viewsContainerSchema = z.record(
	z.string(),
	z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			icon: z.string(),
		}),
	),
)
const viewsSchema = z.record(
	z.string(),
	z.array(
		z.object({
			type: z.string(),
			id: z.string(),
			name: z.string(),
		}),
	),
)
const commandsSchema = z.array(
	z.object({
		command: z.string(),
		title: z.string(),
		category: z.string().optional(),
		icon: z.string().optional(),
	}),
)
const menuItemSchema = z.object({
	group: z.string(),
	command: z.string().optional(),
	submenu: z.string().optional(),
	when: z.string().optional(),
})
const menusSchema = z.record(z.string(), z.array(menuItemSchema))
const submenusSchema = z.array(
	z.object({
		id: z.string(),
		label: z.string(),
	}),
)
const configurationPropertySchema = z.object({
	type: z.union([
		z.literal("string"),
		z.literal("array"),
		z.literal("object"),
		z.literal("boolean"),
		z.literal("number"),
	]),
	items: z
		.object({
			type: z.string(),
		})
		.optional(),
	properties: z.record(z.string(), z.any()).optional(),
	default: z.any().optional(),
	description: z.string(),
})
const configurationSchema = z.object({
	title: z.string(),
	properties: z.record(z.string(), configurationPropertySchema),
})
export const contributesSchema = z.object({
	viewsContainers: viewsContainerSchema,
	views: viewsSchema,
	commands: commandsSchema,
	menus: menusSchema,
	submenus: submenusSchema,
	configuration: configurationSchema,
})
