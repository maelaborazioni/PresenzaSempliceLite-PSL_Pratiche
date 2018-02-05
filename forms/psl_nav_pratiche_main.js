/**
 * @param record
 *
 * @properties={typeid:24,uuid:"7FD7B88A-ECFC-4AD8-A3C8-F80B8E1BFF6A"}
 */
function onFormStateDataChange(record)
{
	getCurrentTab().onFormStateDataChange(record);
}

/**
 * @properties={typeid:24,uuid:"6B6E0AEF-DDF9-411B-9D0B-1BEB22835796"}
 */
function getName()
{
	return scopes.psl.Sezioni.PRATICHE['nome'];
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_processingstate>} 
 * 			record
 * @param {String} 
 * 			[atStep] il nome del passo al quale aprire la pratica
 *
 * @properties={typeid:24,uuid:"57D0E96F-135E-43CC-857C-D8710469AC15"}
 */
function openElaboration(record, atStep)
{
	try
	{
		var codiceCategoria = record.psl_forms_processingstate_to_psl_pratiche.codice_categoria; 
		
		// Filtra la valuelist delle pratiche
		scopes.psl.Pratiche.FiltraElencoPratiche(codiceCategoria);
		// Apri il tab per la categoria corrente
		gotoPratica(codiceCategoria);
				
		if(!getCurrentTab().openElaboration(record))
			throw new Error('i18n:ma.psl.pratiche.err.open_elaboration');
		
		var result;
		if (atStep)
			result = getCurrentTab().gotoStep(atStep);
		else
			result = getCurrentTab().gotoFirstStep();
		
		return !result.error;
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		return false;
	}
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_processingstate>} record
 *
 * @properties={typeid:24,uuid:"B360EF42-BDB7-45EE-A6BC-D546C88679E6"}
 */
function isElaborationOpen(record)
{
	return getCurrentTab().elaboration_id == record.elaboration_id;
}

/**
 * @param record
 *
 * @properties={typeid:24,uuid:"72BDCD86-7167-4BD7-A442-DAB320F5BC82"}
 */
function deleteElaboration(record)
{
	return getCurrentTab().deleteElaboration(record);
}

/**
 * @properties={typeid:24,uuid:"EDEC0148-67BB-4E57-8DDB-E7A032113F01"}
 */
function getCurrentTab()
{
	/** @type {RuntimeForm<psl_nav_pratica>} */
	var form = forms[elements.tab_pratica.getTabFormNameAt(elements.tab_pratica.tabIndex)];
	return form;
}

/**
 * @param {String} name
 *
 * @properties={typeid:24,uuid:"13C517E7-073D-41C0-9694-7BF9EA1D6E37"}
 */
function gotoPratica(name)
{
	elements.tab_pratica.tabIndex = name;
}

/**
 * @param {String} name
 *
 * @properties={typeid:24,uuid:"B0FF99CF-117C-455D-8171-F5B35D626855"}
 */
function nuovaPratica(name)
{
	gotoPratica(name);
	
	getCurrentTab().resetProcessingState();
	getCurrentTab().gotoFirstStep();
	
	// popola la valuelist per la scelta della pratica
	scopes.psl.Pratiche.FiltraElencoPratiche(name);
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"08154DA4-3C8B-4463-8512-733F1BA29CC0"}
 */
function onQuit(event)
{
	if(_super.onQuit(event))
		return getCurrentTab().onQuit(event);
	
	return false;
}
