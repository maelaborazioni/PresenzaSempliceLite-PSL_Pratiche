/**
 * @properties={typeid:24,uuid:"6EDE82A9-231F-4D1B-AFFC-FC0C137DD0C9"}
 */
function getUploadUrl()
{
	return scopes.psl.Pratiche.Inail.Nome + '/' + _super.getUploadUrl();
}