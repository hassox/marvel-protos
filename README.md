## Marvel Protos

Contains protocol buffer definitions of the Marvel Developer Apis. 

This is simply a translation of their excellent documentation and any errors belong to @hassox.

The marvel protos have been marked up to work with [Fender](https://github.com/hassox/fender.git).

## Dependencies

* [Fender](https://github.com/hassox/fender)
* [Google](https://github.com/hassox/google-protos)

## Usage

You can include this repository as a submodule or simply add it to your protos.json if you're using [protob](https://github.com/square/protob.git).

An example protos.json file:

    [
      { "git": "http://github.com/hassox/google-protos.git" },
      { "git": "http://github.com/hassox/fender.git" },
      { "git": "http://github.com/hassox/marvel-protos.git" }
    ]


