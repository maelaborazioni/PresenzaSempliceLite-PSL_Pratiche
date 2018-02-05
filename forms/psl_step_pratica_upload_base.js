/**
 * @properties={typeid:24,uuid:"1183C961-F058-46B8-A4EC-5F725DA9F24C"}
 */
function disable()
{
	elements.btn_comments.enabled =
	elements.btn_upload.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"624AFC8F-A096-40C2-A8DE-E28D5C3344AB"}
 */
function enable()
{
	elements.btn_comments.enabled =
	elements.btn_upload.enabled = true;
}

/**
 * @properties={typeid:24,uuid:"D266BA56-2DA1-4EAD-B7FE-AA6CD3A1EEA8"}
 */
function getUploadUrl()
{
	return 'upload/' + globals.svy_sec_lgn_owner_id + '/';
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"A0E40D8F-1591-4D86-8F41-2EFBB9CDDF82"}
 */
function onAction$btn_upload(event) 
{
	plugins.file.showFileOpenDialog(uploadForm);
}

/**
 * @param {Array<plugins.file.JSFile>} files
 * 
 * @properties={typeid:24,uuid:"9788B47E-FC3F-4D65-A734-3CE4B2D241D1"}
 */
function uploadForm(files)
{
	try
	{
		var file = files && files[0];
		if(!file)
			return false;
		
		foundset.bytes   = file.getBytes();
		foundset.name    = application.getUUID() + '_' + file.getName();
		foundset.updated = 1;
		
		return databaseManager.saveData(foundset);
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		forms.psl_status_bar.setStatusError(ex.message);
		
		return false;
	}
}

/**
 * @param {Array<plugins.file.JSFile>} files
 * 
 * @properties={typeid:24,uuid:"B203823E-E25E-46D3-9A38-EE94D9C40DB5"}
 */
function uploadToFTP(files)
{
	try
	{
		var file = files && files[0];
		if(!file)
			return false;
		
		var upload_url = encodeURI(getUploadUrl());
		var ftpClient  = scopes.url.ftp.PRATICHE.GetFTPClient();
		
		if(!ftpClient.connect())
			throw new Error(i18n.getI18NMessage('ma.err.ftp_connect', [ftpClient.host]));
	
		if(!ftpClient.cd(upload_url) && !ftpClient.mkdir(upload_url))
			throw new Error(i18n.getI18NMessage('ma.err.ftp_dir', [upload_url]));
	
		var temp_file = plugins.file.createFile(application.getUUID() + '_' + file.getName());		
		if(!temp_file.createNewFile() || !temp_file.setBytes(file.getBytes()))
			return false;
		
		var form_url = temp_file.getName();
		ftpClient.put(temp_file.getAbsolutePath(), form_url);
		
		if(!downloadForm(upload_url + form_url))
		{
			plugins.file.deleteFile(temp_file.getAbsolutePath());
			throw new Error('i18n:ma.err.ftp_put');
		}
		
		return plugins.file.deleteFile(temp_file.getAbsolutePath());
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		return false;
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"CF08A42B-5C80-499F-B2EB-64814EDE5C2E"}
 */
function onAction$btn_comments(event) 
{
	editComments();
}

/**
 * @properties={typeid:24,uuid:"ABD6A46C-75B2-4232-B2A1-4CD77020DC7E"}
 */
function editComments()
{
	forms.psl_pratica_upload_note.show(foundset);
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
 * @protected
 *
 * @properties={typeid:24,uuid:"3485C9B8-EAFF-4219-8542-465681EF1454"}
 */
function onDataChange$chk_comments(oldValue, newValue, event) 
{
	if(!newValue)
		comments = null;
	else
		editComments();
		
	return true
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"491B828B-C759-46C4-8C6C-CA5262F89D8F"}
 */
function onAction$btn_download(event) 
{
	var record = foundset.getSelectedRecord();
	if (record.is_uploaded)
		plugins.file.writeFile(record.name, record.bytes);
	else
		forms.psl_status_bar.setStatusError('Nessun file caricato');
}

/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"19EDBDD5-564B-44B6-8501-362BCB610E9E"}
 */
function onRender$btn_download(event)
{
	var renderable = event.getRenderable();
	var record     = foundset.getRecord(event.getRecordIndex());
	
	if (record && record.is_uploaded)
		renderable.enabled = true;
	else
		renderable.enabled = false;
}
