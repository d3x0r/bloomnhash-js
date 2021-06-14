
import {default as util} from 'util';
import {BloomNHash} from "./bloomNHash.mjs"

const innerLoop = 5000;
const outerLoop = 5;

const hash = new BloomNHash();

var start, end;
var n;
var keys = []


for( var z = 0; z < outerLoop; z++ ) {

start = Date.now()
	for( n = 0; n < innerLoop; n++ ) {
		const key = Math.random() + "Key";
      	  keys.push( key );
		hash.set( key, n );
	}

	end = Date.now();
	console.log( "Set Did",n,"in",end-start, "for", n/((end-start)/1000) );
	start = end;


	for( n = 0; n < innerLoop; n++ ) {
		hash.get( keys[n] ).then( (n)=>(val=>{
	        	if( val != n ) {
				console.log( util.format( "LOOKUP Key-data mismatch!", n, val ) );
			}
			} )(n) );
	}

	end = Date.now();
	console.log( "Lookup Did",n,"in",end-start, "for", n/((end-start)/1000) );
	start = end;
}

async function syncro() {

var start, end;
var n;
var keys = []
const hash = new BloomNHash();

for( var z = 0; z < outerLoop; z++ ) {

	start = Date.now()
	for( n = 0; n < innerLoop; n++ ) {
		const key = Math.random() + "Key";
	      	keys.push( key );
		await hash.set( key, n );
	}

	end = Date.now();
	console.log( "Set Did",n,"in",end-start, "for", n/((end-start)/1000) );
	start = end;


	for( n = 0; n < innerLoop; n++ ) {
		let val = await hash.get( keys[n] );
	        if( val != n ) {
			console.log( util.format( "LOOKUP Key-data mismatch!", n, val ) );
		}
	}

	end = Date.now();
	console.log( "Lookup Did",n,"in",end-start, "for", n/((end-start)/1000) );
	start = end;
}

}

syncro();