/**
 * @properties={typeid:24,uuid:"1BBEE369-22BC-4602-87B4-01A92361FA79"}
 */
function getUploadUrl()
{
	return scopes.psl.Pratiche.Infortunio.Nome + '/' + _super.getUploadUrl();
}