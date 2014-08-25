var registry = require('protob').Compiler.compile('../proto-bundle.json'),
    MarvelService = registry.lookup('marvel.cable.public.MarvelService');

// Setup marvel style authentication for that service
require('./prepare-marvel-service');

var marvelService = new MarvelService();

// Start making some requests

// Simple request
// marvelService.Characters({limit: 2})

// Nested request
marvelService.CharacterComics({characterId: 1011334, comicsRequest: {}})

// Bad Requset
// marvelService.CharacterComics()
.then(function(characters) {
  console.error(require('util').inspect(characters.asJSON(), {depth: null}));

  return marvelService.Character({characterId: '1011334'})
  .then(function(character) {
    console.error(require('util').inspect(character.asJSON(), {depth: null}));
  });
})
.catch(function(err) {
  console.error("There was an error", err);
  if(err.fenderValidationErrors) {
    console.error("\nThere were validation errors:\n");
    console.error(require('util').inspect(err.fenderValidationErrors.asJSON(), {depth: null}));
  }
});

