/**
 * @properties={typeid:24,uuid:"82E6A198-5526-456C-AA02-5BF7AEBE5159"}
 */
function getUploadUrl()
{
	return scopes.psl.Pratiche.Varie.Nome + '/' + _super.getUploadUrl();
}
