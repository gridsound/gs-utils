"use strict";

function GSUloadJSFile( src ) { return $.$loadJS( src ); }
function GSUdownloadURL( name, url ) { $.$downloadURL( name, url ); }
function GSUdownloadBlob( name, blob ) { $.$downloadBlob( name, blob ); }

function GSUhashBuffer( arrBuf ) {
	return crypto.subtle.digest( "SHA-1", arrBuf )
		.then( hash => Array.from( new Uint8Array( hash ) ) )
		.then( arr => arr.map( n => n.toString( 16 ).padStart( 2, "0" ) ).join( "" ) );
}

const GSUopenFileManager = o => new Promise( res => {
	GSUopenFileManager.$inputRes = res;
	GSUopenFileManager.$input
		.$setAttr( "multiple", !!o?.$multiple )
		.$setAttr( "accept", o?.$accept || false )
		.$click();
} );
GSUopenFileManager.$inputRes = null;
GSUopenFileManager.$callback = e => GSUopenFileManager.$inputRes( Array.from( e.target.files ) );
GSUopenFileManager.$input = $( "<input>" )
	.$setAttr( "type", "file" )
	.$onchange( GSUopenFileManager.$callback );

function GSUgetFilesDataTransfert_rec( files, item, path = "" ) {
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

				for ( const ent of entries ) {
					proms.push( GSUgetFilesDataTransfert_rec( files, ent, `${ path }${ item.name }/` ) );
				}
				res( Promise.all( proms ) );
			} );
		}
	} );
}
function GSUgetFilesDataTransfert( dataTransferItems ) {
	const files = [];

	return new Promise( res => {
		const proms = [];

		for ( const it of dataTransferItems ) {
			const ent = it.webkitGetAsEntry();

			if ( ent ) {
				proms.push( GSUgetFilesDataTransfert_rec( files, ent ) );
			}
		}
		Promise.all( proms ).then( () => res( files ) );
	} );
}
