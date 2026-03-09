"use strict";

function GSUloadJSFile( src ) {
	return new Promise( resolve => {
		$( "<script>" )
			.$setAttr( { src, type: "text/javascript" } )
			.$on( "load", resolve )
			.$appendTo( $head );
	} );
}

function GSUgetFileContent( file, format ) {
	return new Promise( res => {
		const rd = new FileReader();

		rd.onload = e => res( e.target.result );
		switch ( format ) {
			case "text": rd.readAsText( file ); break;
			case "array": rd.readAsArrayBuffer( file ); break;
		}
	} );
}

function GSUdownloadURL( name, url ) {
	$( "<a>" )
		.$setAttr( {
			href: url,
			download: name,
			target: "_blank",
		} )
		.$appendTo( $body )
		.$click()
		.$remove();
}

function GSUdownloadBlob( name, blob ) {
	GSUdownloadURL( name, URL.createObjectURL( blob ) );
}

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
