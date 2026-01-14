"use strict";

class GSData {
	#data = null;
	#listeners = [];

	constructor( obj = {} ) {
		this.#data = GSUdeepFreeze( GSUdeepCopy( obj ) );
	}

	// .........................................................................
	$getData( path = "" ) {
		return GSUdotProp( this.#data, path );
	}

	// .........................................................................
	$removeListeners( elem ) {
		GSUarrayRemove( this.#listeners, l => l[ 0 ] === elem );
	}
	$addListeners( elem, cbs ) {
		this.#listeners.push( [ elem, cbs.map( ( [ path, fn ] ) => {
			const target = GSUdotProp( this.#data, path );
			const fn2 = fn.bind( elem );

			if ( target !== undefined ) {
				const calls = [];

				if ( !GSUisObj( target ) ) {
					calls.push( [ "create", target ] );
				} else {
					GSUforEach( target, ( v, k ) => calls.push( [ "create", k, v ] ) );
				}
				if ( calls.length > 0 ) {
					fn2( calls );
				}
			}
			return [ path, fn2 ];
		} ) ] );
	}

	// .........................................................................
	$assign( obj ) {
		const oldData = GSUdeepCopy( this.#data );
		const newData = GSUdeepFreeze( GSUdiffAssign( GSUdeepCopy( oldData ), obj ) );
		const dataDiff = GSUdiffObjects( oldData, newData );

		if ( dataDiff ) {
			this.#data = newData;
			this.#listeners.forEach( GSData.#assign.bind( null, oldData, newData, dataDiff ) );
		}
	}
	static #assign( oldData, data, dataDiff, [ _elem, cbs ] ) {
		cbs.forEach( ( [ path, fn ] ) => {
			const targetDiff = GSUdotProp( dataDiff, path );

			if ( targetDiff !== undefined ) {
				const calls = [];
				const targetData = GSUdotProp( oldData, path );

				GSData.#assign2( calls, targetDiff, targetData, data, path );
				if ( calls.length > 0 ) {
					fn( calls );
				}
			}
		} );
	}
	static #assign2( calls, targetDiff, targetData, newData, path ) {
		if ( targetDiff === GSUdotProp.$undefined ) {
			if ( targetData !== undefined ) {
				calls.push( [ "delete" ] );
			}
		} else if ( targetData === undefined ) {
			calls.push( [ "create", targetDiff ] );
		} else {
			if ( !GSUisObj( targetDiff ) ) {
				calls.push( [ "update", targetDiff ] );
			} else {
				GSUforEach( targetDiff, ( v, k ) => {
					if ( v === undefined ) {
						if ( targetData[ k ] ) {
							calls.push( [ "delete", k ] );
						}
					} else {
						if ( targetDiff[ k ] !== targetData[ k ] ) {
							if ( targetData[ k ] === undefined ) {
								calls.push( [ "create", k, v, v ] );
							} else {
								calls.push( [ "update", k, v, GSUdotProp( newData, path )[ k ] ] );
							}
						}
					}
				} );
			}
		}
	}
}
