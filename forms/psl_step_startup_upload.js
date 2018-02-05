/**
 * @properties={typeid:24,uuid:"9D8E082C-238D-4766-B691-596EE4EA4F8C"}
 */
function getUploadUrl()
{
	return scopes.psl.Pratiche.Startup.Nome + '/' + _super.getUploadUrl();
}
