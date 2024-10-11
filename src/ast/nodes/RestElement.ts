import type { ast } from '../../rollup/types';
import type { HasEffectsContext } from '../ExecutionContext';
import type { NodeInteraction } from '../NodeInteractions';
import { EMPTY_PATH, type ObjectPath, UnknownKey } from '../utils/PathTracker';
import type LocalVariable from '../variables/LocalVariable';
import type Variable from '../variables/Variable';
import type * as nodes from './node-unions';
import type * as NodeType from './NodeType';
import { type ExpressionEntity, UNKNOWN_EXPRESSION } from './shared/Expression';
import { NodeBase } from './shared/Node';
import type { PatternNode } from './shared/Pattern';
import type { VariableKind } from './shared/VariableKinds';

export default class RestElement extends NodeBase<ast.RestElement> implements PatternNode {
	argument!: nodes.DestructuringPattern;
	type!: NodeType.tRestElement;
	private declarationInit: ExpressionEntity | null = null;

	addExportedVariables(
		variables: Variable[],
		exportNamesByVariable: ReadonlyMap<Variable, readonly string[]>
	): void {
		this.argument.addExportedVariables(variables, exportNamesByVariable);
	}

	declare(kind: VariableKind, init: ExpressionEntity): LocalVariable[] {
		this.declarationInit = init;
		return (this.argument as nodes.BindingName).declare(kind, UNKNOWN_EXPRESSION);
	}

	deoptimizePath(path: ObjectPath): void {
		if (path.length === 0) {
			this.argument.deoptimizePath(EMPTY_PATH);
		}
	}

	hasEffectsOnInteractionAtPath(
		path: ObjectPath,
		interaction: NodeInteraction,
		context: HasEffectsContext
	): boolean {
		return (
			path.length > 0 ||
			this.argument.hasEffectsOnInteractionAtPath(EMPTY_PATH, interaction, context)
		);
	}

	markDeclarationReached(): void {
		(this.argument as nodes.BindingName).markDeclarationReached();
	}

	protected applyDeoptimizations(): void {
		this.deoptimized = true;
		if (this.declarationInit !== null) {
			this.declarationInit.deoptimizePath([UnknownKey, UnknownKey]);
			this.scope.context.requestTreeshakingPass();
		}
	}
}
