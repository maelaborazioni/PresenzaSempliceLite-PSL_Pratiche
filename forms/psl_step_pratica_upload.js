/**
 * Called before the form component is rendered.
 *
 * @param {JSRenderEvent} event the render event
 *
 * @private
 *
 * @properties={typeid:24,uuid:"92D57E64-039F-4A1C-9398-5D837BF7E990"}
 */
function onRender$btn_remove(event) 
{
	var renderable = event.getRenderable();
	var record     = foundset.getRecord(event.getRecordIndex());
	
	if(record && (record.psl_forms_uploads_to_psl_forms_uploads_duplicates.getSize() > 0 || record.is_uploaded))
		renderable.enabled = true;
	else
		renderable.enabled = false;
}

/**
 * @properties={typeid:24,uuid:"FB0B959E-9053-4A74-B39B-7B658BF984E4"}
 */
function disable()
{
	_super.disable();
	
	elements.btn_add.enabled =
	elements.btn_remove.enabled = false; 
}

/**
 * @properties={typeid:24,uuid:"038F4AAF-C48F-4561-8DCA-3F891D953462"}
 */
function enable()
{
	_super.enable();
	
	elements.btn_add.enabled =
	elements.btn_remove.enabled = true; 
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EEBC0977-4F61-4D89-B2BA-6497934EF003"}
 */
function onAction$btn_add(event) 
{
	addFile(foundset.getSelectedRecord());
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_uploads>} record
 * 
 * @properties={typeid:24,uuid:"5CB031C9-D360-4F12-9B2F-ADEC5AEFA838"}
 * @SuppressWarnings(unused)
 */
function addFile(record)
{
	var fs = record.foundset;
	
	var newRecord 		    = fs.getRecord(fs.newRecord(fs.getSelectedIndex() + 1));		
		newRecord.form_id   = record.form_id;
	// needed for successful storing of the calculation (see https://support.servoy.com/browse/SVY-7095)
	var temp = newRecord.richiesto;
	newRecord.richiesto = record.richiesto;
    
	emptyFile(newRecord);
	foundset.setSelectedIndex((foundset.getSelectedIndex() + 1 % foundset.getSize()));
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C7488535-5DD8-4F4B-AED4-363CACFCF584"}
 */
function onAction$btn_remove(event) 
{
	if(psl_forms_uploads_to_psl_forms_uploads_duplicates.getSize() > 0)
		removeFile(foundset.getSelectedRecord());
	else
		emptyFile(foundset.getSelectedRecord());
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_uploads>} record
 *
 * @properties={typeid:24,uuid:"3024EB49-39D0-42B1-BB8A-B1E3C0A3D35A"}
 */
function removeFile(record)
{
	return record.foundset.deleteRecord(record);//globals.deleteRecord(record.foundset, record.foundset.getSelectedIndex());
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_uploads>} record
 *
 * @properties={typeid:24,uuid:"F25DF5A7-591D-45B7-98A3-DA9FA9A1D2DE"}
 */
function emptyFile(record)
{
	record.name = record.bytes = null;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"26F45AE4-6191-4276-A41E-88584C645964"}
 */
function onAction$icn_status(event)
{
	foundset.bytes = foundset.name = null;
	databaseManager.saveData(foundset);
}
