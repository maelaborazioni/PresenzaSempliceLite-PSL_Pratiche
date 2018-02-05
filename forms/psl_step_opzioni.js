/**
 * @param state
 *
 * @properties={typeid:24,uuid:"906457CC-98E1-4928-9B95-61EC6484CCCC"}
 */
function isStepEnabled(state)
{
	if(_super.isStepEnabled(state))
	{
		var _status = scopes.psl.Pratiche.GetProcessingState(state);
		// Disabilita la modifica della pratica una volta aperta
		return _status == scopes.psl.Pratiche.StatoElaborazione.NUOVA;
	}
	
	return false;
}

/**
 * @param state
 *
 * @properties={typeid:24,uuid:"41638691-2BA3-4DD5-8819-6F80B7989DAC"}
 */
function afterStep(state)
{
	var result       = _super.afterStep(state);
	var elaboration = scopes.psl.Pratiche.GetProcessingInfo(state);
	
	if(!elaboration.status || elaboration.status < scopes.psl.Pratiche.StatoElaborazione.INVIATA)
		elaboration.status = scopes.psl.Pratiche.StatoElaborazione.IN_CARICAMENTO;
	
	state.data.moduli = getModules(dossier_id);
	
	return result;
}

/**
 * @param {Number} id
 * 
 * @return {Array<{ id: Number, name: String, upload_allowed: Boolean, upload: Boolean }>}
 *
 * @properties={typeid:24,uuid:"074F5C0E-5948-4420-8EAD-8455FA3E712F"}
 * @AllowToRunInFind
 */
function getModules(id)
{
	var modules = [];
	var sqlQuery = "select   m.id_modulo, m.nome, m.ammette_upload, m.upload_obbligatorio\
					from     psl_pratiche p\
						     inner join psl_moduli m on m.id_pratica = p.id_pratica\
					where    p.id_pratica = ?\
					order by m.upload_obbligatorio desc, m.nome;";
	
	var dataset = databaseManager.getDataSetByQuery(globals.Server.MA_PRATICHE, sqlQuery, [id], -1);
	if (dataset)
	{
		for(var r = 1; r <= dataset.getMaxRowIndex(); r++)
			modules.push({ id: dataset.getValue(r, 1), name: dataset.getValue(r, 2), upload_allowed: dataset.getValue(r, 3), mandatory: dataset.getValue(r, 4), upload: false });
	}
	
	return modules;
}

/**
 * @properties={typeid:24,uuid:"45AD0A49-7BA6-4B79-805A-2A297AAEEA00"}
 */
function getMainForm()
{
	return forms.psl_nav_pratica;
}