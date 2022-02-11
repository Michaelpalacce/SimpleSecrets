/**
 * @brief	Operations of the Patch Directive taken from: http://jsonpatch.com/
 */
export enum PatchDirectiveOperation	{
	ADD= "add",
	REMOVE= "remove",
	REPLACE= "replace",
	MOVE= "move",
	COPY= "copy",
	TEST= "test"
}

/**
 * @brief	A single patch directive used to complete one operation
 */
export interface PatchDirective {
	op: PatchDirectiveOperation;
	path: string;
	value?: any;
}

/**
 * @brief	Used when patching kubernetes resources
 */
export interface V1Patch extends Array<PatchDirective>{}
