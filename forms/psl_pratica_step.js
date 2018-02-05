/**
 * @param state
 *
 * @properties={typeid:24,uuid:"3A52CCC8-D189-4680-9D92-F2193F670F38"}
 */
function getSnapshot(state)
{
	return state.elaborazione && state.elaborazione.snapshot && state.elaborazione.snapshot[getName()];
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"D2E516D1-C165-4F3A-A31C-C7A245933141"}
 */
function isProcessingStateFinal(state)
{
	return scopes.psl.Pratiche.GetProcessingState(state) > scopes.psl.Pratiche.GetLastEditableState();
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"63172811-F0FC-4371-A7DA-0DE52E0482A8"}
 */
function getStateChangeParams(state)
{
	return { record: foundset.getSelectedRecord() };
}