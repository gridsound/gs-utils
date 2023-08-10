"use strict";

function GSUloadJSFile( src ) {
	return new Promise( resolve => {
		const js = GSUcreateElement( "script", { src, type: "text/javascript" } );

		js.onload = resolve;
		document.head.append( js );
	} );
}

function GSUgetFilesDataTransfert( dataTransferItems ) {
	const files = [];

	return new Promise( res => {
		const proms = [];

		for ( const it of dataTransferItems ) {
			const ent = it.webkitGetAsEntry();

			if ( ent ) {
				proms.push( _GSUgetFilesDataTransfertRec( files, ent ) );
			}
		}
		Promise.all( proms ).then( () => res( files ) );
	} );
}

function _GSUgetFilesDataTransfertRec( files, item, path = "" ) {
	return new Promise( res => {
		if ( item.isFile ) {
			item.file( f => {
				f.filepath = path + f.name;
				files.push( f );
				res( f );
			} );
		} else if ( item.isDirectory ) {
			const dirReader = item.createReader();

			dirReader.readEntries( entries => {
				const proms = [];

				for ( let ent of entries ) {
					proms.push( _GSUgetFilesDataTransfertRec( files, ent, path + item.name + "/" ) );
				}
				res( Promise.all( proms ) );
			} );
		}
	} );
}
