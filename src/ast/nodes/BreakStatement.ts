import { type HasEffectsContext, type InclusionContext } from '../ExecutionContext';
import type Identifier from './Identifier';
import type * as NodeType from './NodeType';
import { StatementBase } from './shared/Node';

export default class BreakStatement extends StatementBase {
	label!: Identifier | null;
	type!: NodeType.tBreakStatement;

	hasEffects(context: HasEffectsContext): boolean {
		if (this.label) {
			if (!context.ignore.labels.has(this.label.name)) return true;
			context.includedLabels.add(this.label.name);
		} else {
			if (!context.ignore.breaks) return true;
			context.hasBreak = true;
		}
		context.brokenFlow = true;
		return false;
	}

	include(context: InclusionContext): void {
		this.included = true;
		if (this.label) {
			this.label.include();
			context.includedLabels.add(this.label.name);
		} else {
			context.hasBreak = true;
		}
		context.brokenFlow = true;
	}
}
