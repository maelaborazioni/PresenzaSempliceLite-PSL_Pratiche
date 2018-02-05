/**
 * @properties={typeid:24,uuid:"3AA1E6E9-7536-4DB3-AC45-4E25441D08F0"}
 */
function show(fs)
{
	globals.ma_utl_showFormInDialog(controller.getName(), 'i18n:ma.lbl.add_comments', fs);
}
/**
 * Handle changed data.
 *
 * @param {String} oldValue old value
 * @param {String} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"04DF128D-00C2-4A30-8E88-BE1D940AE714"}
 */
function onDataChange(oldValue, newValue, event) 
{
	updated = 1;
	return true;
}
