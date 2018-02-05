/**
 * @param {JSForm} 			   jsForm
 * @param {scopes.psl.Sezione} sezione
 *
 * @properties={typeid:24,uuid:"727B45AE-5D8A-48F2-AF12-5FD8A7D7BA34"}
 */
function getMenuItemOnAction(jsForm, sezione)
{
	var method = jsForm.newMethod(
	"function onAction$" + sezione.nome + "(event){\
		openForm('" + sezione.nome + "');\
	 }");

	return method;
}

/**
 * TODO generated, please specify type and doc for the params
 * @param form
 *
 * @properties={typeid:24,uuid:"77CEE2CB-39B1-4AAD-BD36-694FF1EB1554"}
 */
function openForm(form)
{
	forms.psl_nav_pratiche.nuovaPratica(form);
}