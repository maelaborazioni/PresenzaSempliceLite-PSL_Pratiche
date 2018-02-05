/**
 * @param step
 *
 * @properties={typeid:24,uuid:"7F3CA970-3765-4AEE-885F-CB99276A95EA"}
 */
function getOnDataChangeListeners(step)
{
	return [
		function(oldValue, newValue, event){ state.elaborazione.is_dirty = true; }
		];
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_processingstate>} record
 *
 * @properties={typeid:24,uuid:"4E38AC99-34AE-4DC3-8FB9-1738881C9399"}
 */
function onFormStateDataChange(record)
{
	if(record)
		getCurrentStepForm().updateStatus(record.status);
}

/**
 * @properties={typeid:24,uuid:"81882C4C-C214-47FC-BFCA-81D3452DB42C"}
 */
function getDossierName()
{
	return 'pratica';
}

/**
 * @properties={typeid:24,uuid:"CD14C442-33F8-469F-B8B8-B43B60391D66"}
 */
function getProcessingState(_state)
{
	return scopes.psl.Pratiche.GetProcessingState(_state);
}

/**
 * @properties={typeid:24,uuid:"D955FF85-FB10-416F-9748-CE0C6D2A1EA0"}
 */
function getLastEditableState()
{
	return scopes.psl.Pratiche.GetLastEditableState();
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_processingstate>} [record]
 * 
 * @properties={typeid:24,uuid:"C8220E65-90CD-4EE2-A689-69E2219CFF2D"}
 * @AllowToRunInFind
 */
function saveProcessingState(record)
{
	record = record || getElaborationRecord();
	
	// no elaboration means no new data
	if(!record)
		return true;
		
	if(!_super.saveProcessingState(record))
		return false;
	
	try
	{
		databaseManager.startTransaction();
		
		record.status   = state.elaborazione;
		record.data     = state.data;
		
		if(!databaseManager.commitTransaction())
		{
			globals.ma_utl_logError(new Error('psl: Error while saving the processing state of dossier with id [' + record.dossier_id + ']'));
			globals.ma_utl_logError(databaseManager.getFailedRecords()[0].exception);
			databaseManager.rollbackTransaction();
			
			return false;
		}
	}
	catch(ex)
	{
		globals.ma_utl_logError(new Error(ex));
		databaseManager.rollbackTransaction();
		
		return false;
	}
	
	return true;
}

/**
 * @properties={typeid:24,uuid:"8A005213-4C2D-40D4-BCF7-ABC041C64A0B"}
 */
function getElaborationRecord()
{
	return foundset.getSelectedRecord();
}

/**
 * @param step
 * @param _snapshot
 *
 * @properties={typeid:24,uuid:"E16B7C1D-478A-4B71-8CA7-060BAB8E809A"}
 */
function saveSnapshot(step, _snapshot)
{
	_super.saveSnapshot(step, _snapshot);
	state.elaborazione.snapshot[step.getName()] = _snapshot;
}

/**
 * @param {{ elaboration: JSRecord<db:/ma_framework/psl_forms_processingstate> }} [params]
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"EF85963A-4C9C-4B63-A69E-A1AE0A252B69"}
 */
function restoreProcessingState(params)
{
	var elaboration = (params && params.record) || getElaborationRecord();
	if(!elaboration)
		return;
	
	foundset.loadRecords(elaboration.elaboration_id);
	
	if(elaboration.status)
		state.elaborazione = elaboration.status;
	if(elaboration.data)
		state.data = elaboration.data;
	
	state.params.pratica = { id: elaboration.dossier_id, updated: false };
	
	_super.restoreProcessingState(params);
}

/**
 * @properties={typeid:24,uuid:"27B30ECD-C7E2-4EBB-A026-7DB7BA41DF4D"}
 */
function resetProcessingState()
{
	state.elaborazione = { snapshot: { }, is_dirty: true, status: scopes.psl.Pratiche.StatoElaborazione.NUOVA };
	state.data         = { moduli: [] };
	state.params       = { pratica: { id: null } };
	
	_super.resetProcessingState();
}

/**
 * @param {{ dossier_id: Number }} params
 * 
 * @properties={typeid:24,uuid:"C48DB3B8-7D40-4259-9E01-01ED1DD2276B"}
 */
function newElaboration(params)
{
	var oldState = globals.clone(state);
	try
	{
		if(params)
		{
			var dossierId = params.dossier_id;
			if(!dossierId)
				return;
			
			databaseManager.startTransaction();
			
			var newRecord 			 = foundset.getRecord(foundset.newRecord());
				newRecord.owner_id   = globals.svy_sec_lgn_owner_id;
				newRecord.dossier_id = dossierId;
				
			// save data so the id is defined
			if(!databaseManager.commitTransaction())
				throw databaseManager.getFailedRecords()[0].exception;
		}
	}
	catch(ex)
	{
		databaseManager.rollbackTransaction();
		state = oldState;

		throw ex;
	}
}

/**
 * @properties={typeid:24,uuid:"104A7486-F650-4BC1-B919-3BA87D22D492"}
 * @AllowToRunInFind
 */
function getDossierIdFromName(name)
{
	var fs = datasources.db.ma_pratiche.psl_pratiche.getFoundSet();
	var success = fs.find() && (fs.nome = name) && fs.search() > 0;
	
	if(success)
		return fs.id_pratica;
	else
		throw new Error('No dossier found with name: [' + name  + ']');
}

/**
 * @param record
 *
 * @properties={typeid:24,uuid:"80113143-35ED-4D63-99A6-51BB6FC26672"}
 */
function openElaboration(record)
{
	if(!record)
		return false;
	
	updateProcessingState({ record: record, reset: true });
	
	return true;
}

/**
 * @param record
 *
 * @properties={typeid:24,uuid:"8AEF529A-1C07-4A19-A85F-778EBE41D212"}
 */
function deleteElaboration(record)
{
	if(!record)
		return true;
	
	resetProcessingState();
	
	return record.foundset.deleteRecord(record);
}

/**
 * @properties={typeid:24,uuid:"FD228DE2-12E0-41B5-9246-BE4B78665D4A"}
 */
function finalizeData()
{
	try
	{
		var record = getElaborationRecord();

		var filesUpdated   = (record.status.status >= scopes.psl.Pratiche.StatoElaborazione.INVIATA && record.psl_forms_processingstate_to_psl_forms_uploads_updated.getSize() > 0);
		var dossierUpdated = state.elaborazione.is_dirty;
		
		if(!filesUpdated && !dossierUpdated)
			return { error: false, message: 'La pratica non è stata modificata e non necessita di essere reinviata', jobs: [] };
		else
		{
			/**
			 * Invia un'email al responsabile delle pratiche
			 */
			if(!sendDossierEmail(record))
				return { error: true, message: 'i18n:ma.err.send_email', jobs: [] };
			if(!markAsSent())
				return { error: true, message: 'i18n:ma.psl.err.wiz_state_save', jobs: [] };
				
			return { error: false, message: 'Pratica inviata con successo', jobs: [] };
		}		
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		return { error: true, message: ex.message };
	}
}

/**
 * @properties={typeid:24,uuid:"81154BC3-1D45-425A-AFDD-D2C2FC634F74"}
 */
function markAsSent()
{
	state.elaborazione.is_dirty = false;
	
	if(state.elaborazione.status < scopes.psl.Pratiche.StatoElaborazione.INVIATA)
		state.elaborazione.status   = scopes.psl.Pratiche.StatoElaborazione.INVIATA;
	
	// Reset all uploads' status
	var fsUpdater = databaseManager.getFoundSetUpdater(psl_forms_processingstate_to_psl_forms_uploads);
	
	return fsUpdater.setColumn('updated', 0) && fsUpdater.performUpdate();
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_processingstate>} record
 *
 * @properties={typeid:24,uuid:"FE504CD3-ADF9-4360-8794-B1B91699ABC7"}
 * @AllowToRunInFind
 */
function sendDossierEmail(record)
{
	/**
	 * 0. Recupera i parametri di invio
	 */
	var to   = scopes.psl.Pratiche.EMail.TO;
	var from = scopes.psl.Pratiche.EMail.FROM;
	var cc   = scopes.psl.Pratiche.EMail.CC;
		
	if(!to || !plugins.mail.isValidEmailAddress(to))
		return false;
	
	var dossier  = record.psl_forms_processingstate_to_psl_pratiche.descrizione;
	var username = security.getUserName();
	var owner    = record.psl_forms_processingstate_to_sec_owner.name;
	var subject  = ''
	var text     = '<html>\
						<head>\
						<style type="text/css">\
							p.mail-text {\
								font-family: "PT Sans", Helvetica, Arial, sans-serif;\
								font-size: 12px;\
								color: #434343;\
							}\
							a:hover {\
								color: #172983;\
							}\
							a {\
								color: #E2007A;\
							}\
						</style>\
						</head>\
						<body>\
							@text\
						</body>\
					</html>';
	var attachments = [];
	
	/**
	 * 1. Costruisci la lista degli allegati
	 */
	var uploads  = record.psl_forms_processingstate_to_psl_forms_uploads;
	if(!uploads || !uploads.find())
		throw new Error('i18n:ma.err.findmode');
	
	uploads.bytes = '!=^';
	
	var isUpdate = record.status.status >= scopes.psl.Pratiche.StatoElaborazione.INVIATA;
	if (isUpdate)
	{
		subject = i18n.getI18NMessage('ma.psl.msg.dossier_email_subject_update', [dossier, username, owner, record.elaboration_id]);
		text = text.replace('@text', i18n.getI18NMessage('ma.psl.msg.dossier_email_text_update', [dossier, record.elaboration_id, username, owner, scopes.url.PresenzaSempliceLite]));

		uploads.updated = 1;
		uploads.bytes = '!=^';
	}
	else
	{
		subject = i18n.getI18NMessage('ma.psl.msg.dossier_email_subject', [dossier, username, owner, record.elaboration_id]);
		text = text.replace('@text', i18n.getI18NMessage('ma.psl.msg.dossier_email_text', [dossier, record.elaboration_id, username, owner, scopes.url.PresenzaSempliceLite]));
	}
	
	uploads.search();
	
	for(var r = 1; r <= uploads.getSize(); r++)
	{
		var ul = uploads.getRecord(r);
		attachments.push(plugins.mail.createBinaryAttachment(ul.name, ul.bytes));
	}
	
	/**
	 * 2. Invia il messaggio
	 */
	var mailNotSent = !plugins.mail.sendMail(to, from, subject, text, cc, null, attachments, scopes.utl.GetSmtpProperties()); 
	if (mailNotSent)
	{
		globals.ma_utl_logError(plugins.mail.getLastSendMailExceptionMsg());
		return false;
	}
	
	return true;
}