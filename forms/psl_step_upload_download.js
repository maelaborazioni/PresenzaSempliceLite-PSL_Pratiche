/**
 * @properties={typeid:24,uuid:"E9B0A6F9-8B96-453E-BB08-794FD38B24A4"}
 */
function getName()
{
	return 'documentazione';
}

/**
 * @properties={typeid:24,uuid:"FEE428A8-068E-4F72-B673-A85ADA9E0203"}
 */
function disable()
{
	_super.disable();
	
	getDownloadForm().disable();
	getUploadForm().disable();
}

/**
 * @properties={typeid:24,uuid:"B50C117E-3E0D-492E-80A9-B3DAC6543604"}
 */
function enable()
{
	_super.enable();
	
	getDownloadForm().enable();
	getUploadForm().enable();
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"72F154DE-6C18-4523-B117-E6F2788C88E1"}
 */
function isStepEnabled(state)
{
	if(_super.isStepEnabled(state))
	{
		var _status = scopes.psl.Pratiche.GetProcessingState(state);
		// Disabilita la modifica dei file della pratica una volta elaborata
		return _status < scopes.psl.Pratiche.StatoElaborazione.ELABORATA;
	}
	
	return false;
}

/**
 * @return {RuntimeForm<psl_step_moduli>}
 * 
 * @properties={typeid:24,uuid:"30152C20-6FCE-48A4-B321-ADC8BC8F9F74"}
 */
function getDownloadForm()
{
	/** @type {RuntimeForm<psl_step_moduli>} */
	var form = forms[elements.download_upload_tab.getTabFormNameAt(1)];
	return form;
}

/**
 * @return {RuntimeForm<psl_step_moduli>}
 * 
 * @properties={typeid:24,uuid:"9166A33B-38A0-4680-996A-178B6655A7AE"}
 */
function getUploadForm()
{
	/** @type {RuntimeForm<psl_step_moduli>} */
	var form = forms[elements.download_upload_tab.getTabFormNameAt(2)];
	return form;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"474011EB-F109-4E79-9033-4E17F758406A"}
 * @AllowToRunInFind
 */
function beforeStep(state)
{
	var result = _super.beforeStep(state);
	if (result.error)
		return result;
	
	var success = true;
	/** @type {Array} */
	var modules = state.data.moduli;
	
	psl_forms_processingstate_to_psl_forms_uploads.loadAllRecords();
	
	var old_uploads = globals.foundsetToArray(psl_forms_processingstate_to_psl_forms_uploads, 'form_id');
	var new_uploads = modules.filter(function(_){ return _.upload_allowed == 1; }).map(function(_){ return _.id; });
	
	filterDownloads(modules.map(function(_){ return _.id; }));
	initUploads(old_uploads, new_uploads);
	
	var hasDownloads = psl_forms_processingstate_to_psl_pratiche.psl_pratiche_to_psl_moduli.getSize() > 0;
	var hasUploads   = new_uploads.length > 0;
	
	elements.download_upload_tab.setTabEnabledAt(1, hasDownloads);
	elements.download_upload_tab.setTabEnabledAt(2, hasUploads);
	
	if(isDisabled() || (!hasDownloads && hasUploads))
		elements.download_upload_tab.tabIndex = 'upload';
	else
		elements.download_upload_tab.tabIndex = 'download';
		
	return { error: !success, message: '' };
}

/**
 * @param {Array} ids
 *
 * @properties={typeid:24,uuid:"FD9390A9-AB17-411A-ACCD-04DEC464F755"}
 * @AllowToRunInFind
 */
function filterDownloads(ids)
{
	var fs = psl_forms_processingstate_to_psl_pratiche.psl_pratiche_to_psl_moduli;
	if(!fs)
		throw new scopes.error.NullReferenceError('fs');

	if(!fs.find())
	{
		globals.ma_utl_logError(new Error(globals.from_i18n('i18n:ma.err.findmode', ['filterDownloads'])));
		return false;
	}
	
	fs.id_modulo = ids;
	fs.file_url = '!^';
		
	return fs.search() > 0;
}

/**
 * @properties={typeid:24,uuid:"096C8451-398A-4ACC-B8D4-86B4FE906B8B"}
 * @AllowToRunInFind
 */
function filterUploads(mandatory_uploads, optional_uploads)
{
	/** @type {JSFoundset<db:/ma_framework/psl_forms_uploads>}*/
	var mandatoryUploads = getTabAt(2).foundset;
	if(!mandatoryUploads || !mandatoryUploads.find())
		throw new Error(i18n.getI18NMessage('ma.err.findmode'));
	
	mandatoryUploads.elaboration_id = elaboration_id;
	mandatoryUploads.form_id = mandatory_uploads;
	mandatoryUploads.search();
	
	/** @type {JSFoundset<db:/ma_framework/psl_forms_uploads>}*/
	var optionaUploads = getTabAt(3).foundset;
	if(!optionaUploads || !optionaUploads.find())
		throw new Error(i18n.getI18NMessage('ma.err.findmode'));
	
	optionaUploads.elaboration_id = elaboration_id;
	optionaUploads.form_id = optional_uploads;
	optionaUploads.search();
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"E2027D28-B814-4601-9B5A-344A5F8E0BB5"}
 */
function afterStep(state)
{
	var success = true, message = '';
	
	var fs = psl_forms_processingstate_to_psl_forms_uploads;
	for(var r = 1; r <= fs.getSize(); r++)
	{
		var record = fs.getRecord(r);
		if (record.is_uploaded)
			markUploaded(state.data.moduli, record.psl_forms_uploads_to_psl_moduli.nome);
		else
		if(!record.richiesto && !(success = success && fs.deleteRecord(record)))
			message = 'i18n:ma.err.save_data';
	}
	
	return { error: !success, message: message };
}


/**
 * @properties={typeid:24,uuid:"203923F5-8DA4-4770-8478-BFCEF682DD70"}
 */
function markUploaded(_forms, _name)
{
	if(_forms)
	{
		var module_index = _forms.map(function(_){ return _.name; }).indexOf(_name);
		if(module_index > -1)
			_forms[module_index].upload = true;
		else
			throw new Error('No form found with name: [' + _name + ']');
	}
}

/**
 * @param {Array} old_uploads
 * @param {Array} new_uploads
 *
 * @properties={typeid:24,uuid:"3AAA5C16-29A5-4AE9-B3F6-B547EE635A87"}
 * @SuppressWarnings(unused)
 */
function initUploads(old_uploads, new_uploads)
{
	var uploads = psl_forms_processingstate_to_psl_forms_uploads;

	var to_add    = scopes.utl.ArrayDifference(new_uploads, old_uploads);
	var to_delete = scopes.utl.IndexesFromArrayDifference(old_uploads, new_uploads);

	var form_file;
	
	// start deleting from the end so we avoid index recalculation
	to_delete.reverse().forEach(
		function(_)
		{ 
			uploads.deleteRecord(_ + 1);
		});
	
	to_add.forEach(
		function(_)
		{
			form_file = uploads.getRecord(uploads.newRecord());
			form_file.form_id = _;
		});
	
	for(var r = 1; r <= uploads.getSize(); r++)
	{
		form_file = uploads.getRecord(r);
		// needed to successfully store the calculation (see https://support.servoy.com/browse/SVY-7095)
		var temp = form_file.richiesto;
		form_file.richiesto = form_file.psl_forms_uploads_to_psl_moduli.upload_obbligatorio;
	}
	
	uploads.sort('form_id asc');
}

/**
 *
 * @properties={typeid:24,uuid:"BE47D65E-755A-4B7A-B86A-25F14ADEFC28"}
 */
function getTabAt(index)
{
	return forms[elements.download_upload_tab.getTabFormNameAt(index)];
}

/**
 * @properties={typeid:24,uuid:"F2F39EF0-A2BC-4C05-87C7-C1D0CC1FA753"}
 */
function getStepInfo()
{
	var text = 'Nella sezione <em>Modelli da scaricare</em> sono mostrati i documenti disponibili per il download, se presenti.\
	     Per visualizzare l\'elenco dei documenti richiesti dallo studio, clicca sulla sezione intitolata <em>Invio documentazione</em>.\
	     Le icone presenti su ogni riga ti aiutano ad identificare la natura del documento:\
	    	<ul>\
	    		<li>l\'icona <img src="@0" /> indica che il documento è obbligatorio e non è ancora stato caricato;\
	    		<li>l\'icona <img src="@1" /> indica che il documento è stato caricato, ma non ancora ricevuto dallo studio;\
	    		<li>l\'icona <img src="@2" /> indica che il documento è stato caricato e ricevuto dallo studio, oppure che il suo invio è facoltativo.\
	    	</ul>\
	     Passando il mouse sull\'icona è possibile visualizzare una descrizione dello stato del documento.<br/>\
	     Le restanti icone permettono di gestire i documenti. In particolare, l\'icona <img src="@3"/> duplica il documento selezionato, permettendo di \
	     caricare più copie di un file, se necessario, mentre l\'icona <img src="@4"/> elimina il documento selezionato. Nota che è possibile \
	     eliminare i soli documenti duplicati, e non le versioni originali. Infine, l\'icona <img src="@5"/> permette l\'inserimento di eventuali note integrative.' 
	
	return scopes.string.Format(
				  text
			    , 'mediafolder?id=status_error_18.png&s=PresenzaSempliceLite&option=14&w=18&h=18'
				, 'mediafolder?id=status_warning_18.png&s=PresenzaSempliceLite&option=14&w=18&h=18'
			    , 'mediafolder?id=status_ok_18.png&s=PresenzaSempliceLite&option=14&w=18&h=18'
			    , 'mediafolder?id=blue/plus.png&s=PresenzaSempliceLite&option=14&w=18&h=18'
			    , 'mediafolder?id=blue/minus.png&s=PresenzaSempliceLite&option=14&w=18&h=18'
			    , 'mediafolder?id=blue/edit.png&s=PresenzaSempliceLite&option=14&w=18&h=18'
			);
}