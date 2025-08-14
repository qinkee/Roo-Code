type CopyPathOptions = {
	optional?: boolean
}
export declare function copyPaths(copyPaths: [string, string, CopyPathOptions?][], srcDir: string, dstDir: string): void
export declare function copyWasms(srcDir: string, distDir: string): void
export declare function copyLocales(srcDir: string, distDir: string): void
export declare function setupLocaleWatcher(srcDir: string, distDir: string): void
export declare function generatePackageJson({
	packageJson: { contributes, ...packageJson },
	overrideJson,
	substitution,
}: {
	packageJson: Record<string, any>
	overrideJson: Record<string, any>
	substitution: [string, string]
}): {
	contributes: {
		viewsContainers: Record<
			string,
			{
				id: string
				title: string
				icon: string
			}[]
		>
		views: Record<
			string,
			{
				type: string
				id: string
				name: string
			}[]
		>
		commands: unknown[]
		menus: Record<
			string,
			{
				group: string
				command?: string | undefined
				submenu?: string | undefined
				when?: string | undefined
			}[]
		>
		submenus: unknown[]
		configuration: {
			title: string
			properties: Record<
				string,
				{
					type: "string" | "number" | "boolean" | "object" | "array"
					description: string
					items?:
						| {
								type: string
						  }
						| undefined
					properties?: Record<string, any> | undefined
					default?: any
				}
			>
		}
	}
}
export {}
//# sourceMappingURL=esbuild.d.ts.map
