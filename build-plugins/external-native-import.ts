import type { Plugin } from 'rollup';

export function externalNativeImport(): Plugin {
	return {
		name: 'copy-native-files',
		async resolveId(id, importer) {
			if (id.includes('/native')) {
				const resolved = await this.resolve(id, importer!, { skipSelf: true });
				return {
					external: 'relative',
					id: resolved!.id
				};
			}
		}
	};
}