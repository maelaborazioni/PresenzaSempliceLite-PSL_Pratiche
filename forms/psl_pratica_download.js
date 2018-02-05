/**
 * @param {String} file
 * 
 * @properties={typeid:24,uuid:"0A140567-1B2A-48EF-95D8-5F11B665420A"}
 */
function getDownloadUrl(file)
{
	return scopes.string.Format("/@0/@1", "download", file);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"6F46AF4A-FA1F-4932-AABB-20E77AA434C0"}
 */
function onAction$btn_download(event) 
{
	var record = foundset.getSelectedRecord();
	
	var file = downloadForm(getDownloadUrl(record.file_url));
	if (file)
	{
		var ext = record.file_url.match(/\.([^\.]+)$/gi);
			ext = (ext && ext[0]) || '';
			
		plugins.file.writeFile(record.descrizione + ext, file);
	}
	else
		forms.psl_status_bar.setStatusError('Errore durante il download del file, contattare lo studio');
}

/**
 * @properties={typeid:24,uuid:"261F473F-667D-41D1-A429-939F5F78DDA2"}
 */
function disable()
{
	elements.btn_download.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"EA34C3CE-2248-4433-9708-323FDD7D643C"}
 */
function enable()
{
	elements.btn_download.enabled = true;
}