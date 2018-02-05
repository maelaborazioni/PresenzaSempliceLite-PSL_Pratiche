/**
 * @properties={typeid:24,uuid:"7ADF8A53-C025-431B-B076-416320A7D8D0"}
 */
function getUploadUrl()
{
	return scopes.psl.Pratiche.Collocamento.Nome + '/' + _super.getUploadUrl();
}
