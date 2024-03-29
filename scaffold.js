var path = require( 'path' )
var fs = require( 'fs' )
var scripts = path.join( process.env.HOME, '.scaffold' )

try{ fs.mkdirSync( scripts ) }catch( e ){}

function error( error ){
  console.error( 'ERROR', error )
  die()
}
function die( message ){
  if( message ) console.log( message )
  process.exit()
}

function normalize( filepath ){
  if( filepath.substr( 0, 1 ) === '~' ){
    filepath = process.env.HOME + filepath.substr( 1 )
  }
  return filepath
}

function copy( src, dest, callback ){
  src = path.resolve( src )
  dest = path.resolve( dest )

  if( fs.existsSync( dest ) ) die( dest + ' already exists' )

  var read = fs.createReadStream( src )
  var write = fs.createWriteStream( dest )

  read.on( 'error', error )
  write.on( 'error', error )
  write.on( 'close', callback )

  read.pipe( write )
}

function save( src, name ){
  if( !( name && src ) ){
    die( help( 'create' ) )
  }
  copy( normalize( src ), path.join( scripts, name ), function(){
    console.log( 'Template ' + name + ' saved' )
  })
}

function help( command ){
  var commands = {
    help: 'Shows this help',
    build: '$ scaffold build <template-name> <build-file>',
    save: '$ scaffold save <source-file> <template-name>'
  }

  if( command ){
    console.log( command + '\n' + commands[ command ] )
  } else {
    var keys = Object.keys( commands )
    console.log( keys.map( function( key ){
      return key + '\n' + commands[key]
    }).join( '\n\n' ) )
  }
}

function build( name, dest ){
  if( !( name && dest ) ){
    die( help( 'create' ) )
  }
  copy( path.join( scripts, name ), normalize( dest ), function(){
    console.log( 'Built template ' + name + ' to ' + dest )
  })
}

module.exports = {
  save: save,
  help: help,
  build: build
}
