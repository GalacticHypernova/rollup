import type { ast } from '../../rollup/types';
import type { InclusionContext } from '../ExecutionContext';
import type ChildScope from '../scopes/ChildScope';
import ClassBodyScope from '../scopes/ClassBodyScope';
import type MethodDefinition from './MethodDefinition';
import type * as NodeType from './NodeType';
import type PropertyDefinition from './PropertyDefinition';
import type ClassNode from './shared/ClassNode';
import { type IncludeChildren, NodeBase } from './shared/Node';
import type StaticBlock from './StaticBlock';

export default class ClassBody extends NodeBase<ast.ClassBody> {
	body!: (MethodDefinition | PropertyDefinition | StaticBlock)[];
	scope!: ClassBodyScope;
	type!: NodeType.tClassBody;

	createScope(parentScope: ChildScope): void {
		this.scope = new ClassBodyScope(parentScope, this.parent as ClassNode<any>);
	}

	include(context: InclusionContext, includeChildrenRecursively: IncludeChildren): void {
		this.included = true;
		this.scope.context.includeVariableInModule(this.scope.thisVariable);
		for (const definition of this.body) {
			definition.include(context, includeChildrenRecursively);
		}
	}

	parseNode(esTreeNode: ast.ClassBody): this {
		const body: (MethodDefinition | PropertyDefinition | StaticBlock)[] = (this.body = []);
		for (const definition of esTreeNode.body) {
			body.push(
				new (this.scope.context.getNodeConstructor<any>(definition.type))(
					this,
					(definition as MethodDefinition | PropertyDefinition).static
						? this.scope
						: this.scope.instanceScope
				).parseNode(definition)
			);
		}
		return super.parseNode(esTreeNode);
	}

	protected applyDeoptimizations() {}
}
