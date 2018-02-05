/**
 * @properties={typeid:24,uuid:"F4DCEEE0-193C-41A1-893B-B8F0727667CE"}
 */
function getDataSection()
{
	return forms.psl_nav_pratiche_main;
}

/**
 * @properties={typeid:24,uuid:"2890DC3B-6961-42B6-B24D-D69913F720F5"}
 */
function getSections()
{
	return scopes.psl.Sezioni.PRATICHE['sottoSezioni'];
}

/**
 * @param {String} name
 *
 * @properties={typeid:24,uuid:"68B57D4C-ACF4-4719-8F34-537F7ACBDA55"}
 */
function nuovaPratica(name)
{
	try
	{
		openDataSection();
		getDataSection().nuovaPratica(name);
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		//TODO i18n
		forms.psl_status_bar.setStatusError('Impossibile creare la pratica. Contattare lo studio.');
	}
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_processingstate>} record
 * @param {String} [atStep]
 * 
 * @properties={typeid:24,uuid:"61261BC3-FCD3-47A8-A04F-075A11E281BE"}
 */
function openPratica(record, atStep)
{
	openDataSection();
	getDataSection().openElaboration(record, atStep);
}