/**
 * @properties={typeid:24,uuid:"425C2B7C-EB83-4B22-B61E-2D6CB799AD70"}
 */
function getUploadUrl()
{
	return scopes.psl.Pratiche.Variazioni.Nome + '/' + _super.getUploadUrl();
}