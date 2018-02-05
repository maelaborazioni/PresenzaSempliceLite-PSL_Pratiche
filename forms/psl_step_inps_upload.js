/**
 * @properties={typeid:24,uuid:"7B229F07-C440-4AD8-9817-2D70780CB21C"}
 */
function getUploadUrl()
{
	return scopes.psl.Pratiche.Inps.Nome + '/' + _super.getUploadUrl();
}
