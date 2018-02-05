/**
 * @param {String} _url
 *
 * @properties={typeid:24,uuid:"1812EE65-684F-4714-9315-2EBAE0B4278B"}
 */
function downloadForm(_url)
{
	var ftpClient = scopes.url.ftp.PRATICHE.GetFTPClient();
	if(!ftpClient.connect())
		throw new Error(i18n.getI18NMessage('ma.err.ftp_connect', [ftpClient.host]));
	
	var formUrl  = _url;
	var tempFile = plugins.file.createTempFile(application.getUUID().toString(), '.temp');
	
	ftpClient.get(formUrl, tempFile.getAbsolutePath());
	
	var bytes = plugins.file.readFile(tempFile.getAbsolutePath());
	if(!bytes || bytes.length == 0)
		throw new Error(i18n.getI18NMessage('ma.err.ftp_get', [_url]));
	
	if(ftpClient.disconnect())
		return bytes;
	
	return null;
}

/**
 * @properties={typeid:24,uuid:"4C755CB4-A9BF-4D25-9E67-5C43A63B481F"}
 */
function enable()
{
	
}

/**
 * @properties={typeid:24,uuid:"FCE4C6CC-F0BE-4B42-9F35-5CAFE38D1003"}
 */
function disable()
{
	
}