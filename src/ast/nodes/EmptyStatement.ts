import type { ast } from '../../rollup/types';
import type * as NodeType from './NodeType';
import { NodeBase } from './shared/Node';

export default class EmptyStatement extends NodeBase<ast.EmptyStatement> {
	type!: NodeType.tEmptyStatement;

	hasEffects(): boolean {
		return false;
	}
}
