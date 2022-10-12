# Encrypt properties
This folder explains how to enable property encryption, and how to encrypt and decrypt values.

We are using [jasypt](http://www.jasypt.org/)

## How to use
### Preliminaries
In this folder, run:

* `./unpack-jasypt.sh`
* `npm install`

### Working with our tooling
A number of Node.js scripts are provided here to make dealing with encrypted properties smoother. These follow the Unix
convention of converting standard input to standard output, so they can be piped together.

#### How to add encrypted values to the property files
1. Check the following entry under `Tech logins` in 1Password to see if there's already an encryption key for the given environment: `Passwords for encrypted property files`.
1. If there's not yet a password, create one by adding a new field to the entry in 1Password.
1. Run `node encrypt-properties.js --help` to learn how to encrypt properties in a file.
1. Make sure that the password is added to the following environment variable, and present when the app is running in the given environment: `properties_decrypt_key`.

#### How to view/diff property files with encrypted properties
1. Find the password for the environment under `Tech logins` in 1Password.
1. Run `node decrypt-properties.js --help` for more information.

#### How to re-encrypt a properties file with a new password
1. Run `node encrypt-properties-with-new-password.js --help` for more information.

### Work with the Jasypt CLI directly

See the [official documentation](http://www.jasypt.org/cli.html) for further details.

If you get a EncryptionOperationNotPossibleException when the application tries to decrypt the value, double check that
the algorithm and IV generator arguments you've provided to the jasypt binary match the values in `EncryptablePropertiesFactory.java`.

### How to upgrade Jasypt
We have included the jasypt distribution zip in our repo for convenience and consistency.

The current version is **1.9.3** and was downloaded from the following URL: https://github.com/jasypt/jasypt/releases/download/jasypt-1.9.3/jasypt-1.9.3-dist.zip

