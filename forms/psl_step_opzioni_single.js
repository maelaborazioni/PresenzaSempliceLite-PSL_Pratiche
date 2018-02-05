/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"34CD2A40-8940-4B9D-B963-FFFDCDEBB23E",variableType:4}
 */
var v_dossier_id;

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"1B06E34F-7604-4726-B2B9-841687B29E8B"}
 */
function initState(state)
{
	_super.initState(state);
	v_dossier_id = null;
}

/**
 * @param snapshot
 * @param state
 *
 * @properties={typeid:24,uuid:"172C5462-6F6E-48F2-9E9C-E8E953D7A4AF"}
 */
function restoreStateFromSnapshot(snapshot, state)
{
	v_dossier_id = snapshot.v_dossier_id;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"C26D2BE9-01E5-43A1-A3AE-12B664F4D0A6"}
 */
function saveState(state)
{
	return { v_dossier_id: v_dossier_id };
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"1E95020F-58A2-49CD-8630-B5685F09FD9A"}
 */
function validateStep(state)
{
	var isValid = !globals.ma_utl_isNullOrUndefined(v_dossier_id);
	if(!isValid)
		state.error = 'i18n:ma.msg.no_selection';
			
	return isValid;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"ECDB7E7A-67C5-4EE2-B41F-8C833722DAFA"}
 */
function beforeStep(state)
{
	if(!v_dossier_id)
		v_dossier_id = application.getValueListItems('vls_pratiche').getValue(1, 2);
			
	return _super.beforeStep(state);
}

/**
 * @properties={typeid:24,uuid:"C2CFC937-EA2A-4329-A82D-BDB00A9F3A0A"}
 */
function disable()
{
	_super.disable();
	elements.rad_child_dossier.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"A72352E4-9893-4FF2-A1D7-6A8BB27B8410"}
 */
function enable()
{
	_super.enable();
	elements.rad_child_dossier.enabled = true;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"5DEDD055-A419-40A9-8989-3BD0DFCB0A2E"}
 */
function afterStep(state)
{
	state.params.pratica.id = v_dossier_id;
	
	var elaborazione = scopes.psl.Pratiche.GetProcessingInfo(state);	
	// Crea il record solo se in fase di apertura pratica
	if (elaborazione['status'] == scopes.psl.Pratiche.StatoElaborazione.NUOVA)
		getMainForm().newElaboration({ dossier_id: v_dossier_id });
	
	return _super.afterStep(state);
}