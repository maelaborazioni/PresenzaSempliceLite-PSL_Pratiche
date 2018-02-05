/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"DC8EAD2B-3B85-45E9-8066-B69FE850F198",variableType:4}
 */
var v_itinere = 0;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"361A1B8A-56AC-4E84-A56E-E1D4A67DA3D6",variableType:4}
 */
var v_rimborso = 0;

/**
 * @properties={typeid:24,uuid:"444AEF33-4E7C-43B7-A23E-7F189E318F87"}
 */
function getName()
{
	return scopes.psl.Pratiche.Infortunio.Sezioni.OPZIONI;
}

/**
 * @properties={typeid:24,uuid:"6FF43593-B737-492D-9BC9-D11AAC09E26D"}
 */
function getMainForm()
{
	return forms.psl_nav_infortunio;
}

/**
 * @properties={typeid:24,uuid:"7A7B7CEF-A9B4-4037-A36B-B7FEDDB7D7EA"}
 */
function saveState(state)
{
	var _snapshot = 
	{
		v_itinere	: v_itinere,
		v_rimborso	: v_rimborso
	}
	
	return _snapshot;
}

/**
 * @param _snapshot
 * @param state
 *
 * @properties={typeid:24,uuid:"2C190423-841C-4603-A7CD-0DD871F9DC52"}
 */
function restoreStateFromSnapshot(_snapshot, state)
{
	v_itinere  = _snapshot.v_itinere;
	v_rimborso = _snapshot.v_rimborso;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"BD271E74-A638-40AD-949B-F149674D8075"}
 */
function initState(state)
{
	v_itinere = v_rimborso = 0;
}

/**
 * @properties={typeid:24,uuid:"A5E4A2DF-8660-4D16-AF55-1212AF897017"}
 */
function disable()
{
	_super.disable();
	
	elements.chk_itinere.enabled  = 
	elements.chk_rimborso.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"3A62FE23-5BA7-4D3A-B59C-19E3EE024980"}
 */
function enable()
{
	_super.enable();
	
	elements.chk_itinere.enabled  = 
	elements.chk_rimborso.enabled = true;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"FF44A90F-F56D-4490-B72B-F9F1CFBCDF33"}
 */
function beforeStep(state)
{
	// abilita correttamente gli elementi a seconda dello stato salvato
	elements.chk_rimborso.enabled = v_rimborso == 1;
	return _super.beforeStep(state);
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"FFF1E57D-6637-46FB-A666-D8A798E3F314"}
 */
function afterStep(state)
{
	_super.afterStep(state);
	
	/** @type {Array} */
	var moduli = state.data.moduli;
	
	var moduleIndex = -1;
	if(!v_itinere)
	{
		moduleIndex = moduli.map(function(_){ return _.name; }).indexOf('itinere');
		moduli.splice(moduleIndex, 1);
	}

	if(!v_rimborso)
	{
		moduleIndex = moduli.map(function(_){ return _.name; }).indexOf('rimborso');
		moduli.splice(moduleIndex, 1);
	}
	
	return { error: false, message: '' };
}
/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"19B99AA6-01B8-45A3-B77E-F08078CEAF93"}
 */
function onDataChange$chk_itinere(oldValue, newValue, event) 
{
	if(newValue)
		elements.chk_rimborso.enabled = true;
	else
	{
		v_rimborso = 0;
		elements.chk_rimborso.enabled = false;
	}
	
	return true;
}