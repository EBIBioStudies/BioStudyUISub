SystemJS.config({
    nodeConfig: {
        "paths": {
            "lib/": "lib/"
        }
    },
    devConfig: {
        "map": {
            "plugin-babel": "npm:systemjs-plugin-babel@0.0.16",
            "ts": "github:frankwallis/plugin-typescript@5.2.6",
            "text": "github:systemjs/plugin-text@0.0.9"
        },
        "packages": {
            "github:frankwallis/plugin-typescript@5.2.6": {
                "map": {
                    "typescript": "npm:typescript@2.0.3"
                }
            }
        }
    },
    transpiler: "plugin-babel",
    babelOptions: {
        "compact": true
    },
    packages: {
        "lib": {
            "defaultExtension": "ts",
            "main": "main",
            "meta": {
                "*.js": {
                    "loader": "plugin-babel"
                },
                "*.ts": {
                    "loader": "ts"
                },
                "*.css": {
                    "loader": "css"
                },
                "*.html": {
                    "loader": "text"
                },
                "*.json": {
                    "loader": "text"
                }
            }
        }
    },
    map: {
        "ag-grid-ng2": "other:ag-grid-ng2",
        "ag-grid": "other:ag-grid"
    }
});

SystemJS.config({
    packageConfigPaths: [
        "npm:@*/*.json",
        "npm:*.json",
        "github:*/*.json",
        "other:*.json",
        "other:@*/*.json"
    ],
    map: {
        "css": "github:systemjs/plugin-css@0.1.32",
        "domain": "npm:jspm-nodelibs-domain@0.2.0",
        "errno": "npm:errno@0.1.4",
        "graceful-fs": "npm:graceful-fs@4.1.11",
        "image-size": "npm:image-size@0.5.0",
        "es6-shim": "github:es-shims/es6-shim@0.35.1",
        "jspm-nodelibs-process": "npm:jspm-nodelibs-process@0.2.0",
        "less": "npm:less@2.7.1",
        "mime": "npm:mime@1.3.4",
        "mkdirp": "npm:mkdirp@0.5.1",
        "ng2-recaptcha": "npm:ng2-recaptcha@1.4.0",
        "angular2-recaptcha": "npm:angular2-recaptcha@0.3.3",
        "ng2-smart-table": "npm:ng2-smart-table@0.4.0-3",
        "monospaced/angular-elastic": "github:monospaced/angular-elastic@2.5.1",
        "ng2-cookies": "npm:ng2-cookies@1.0.2",
        "ng2-bootstrap": "npm:ng2-bootstrap@1.3.3",
        "@angular/http": "npm:@angular/http@2.3.1",
        "@angular/router": "npm:@angular/router@3.0.2",
        "core-js": "npm:core-js@2.4.1",
        "@angular/forms": "npm:@angular/forms@2.3.1",
        "@angular/common": "npm:@angular/common@2.3.1",
        "@angular/compiler": "npm:@angular/compiler@2.3.1",
        "@angular/core": "npm:@angular/core@2.3.1",
        "@angular/platform-browser": "npm:@angular/platform-browser@2.3.1",
        "@angular/platform-browser-dynamic": "npm:@angular/platform-browser-dynamic@2.3.1",
        "@angular/upgrade": "npm:@angular/upgrade@2.0.1",
        "assert": "npm:jspm-nodelibs-assert@0.2.0",
        "bootstrap": "github:twbs/bootstrap@3.3.7",
        "buffer": "npm:jspm-nodelibs-buffer@0.2.0",
        "constants": "npm:jspm-nodelibs-constants@0.2.0",
        "crypto": "npm:jspm-nodelibs-crypto@0.2.0",
        "events": "npm:jspm-nodelibs-events@0.2.0",
        "font-awesome": "npm:font-awesome@4.7.0",
        "fs": "npm:jspm-nodelibs-fs@0.2.0",
        "lodash": "npm:lodash@4.17.4",
        "os": "npm:jspm-nodelibs-os@0.2.0",
        "path": "npm:jspm-nodelibs-path@0.2.0",
        "process": "npm:jspm-nodelibs-process@0.2.0",
        "promise": "npm:promise@7.1.1",
        "reflect-metadata": "npm:reflect-metadata@0.1.8",
        "rxjs": "npm:rxjs@5.0.0-rc.4",
        "source-map": "npm:source-map@0.5.6",
        "stream": "npm:jspm-nodelibs-stream@0.2.0",
        "string_decoder": "npm:jspm-nodelibs-string_decoder@0.2.0",
        "timers": "npm:jspm-nodelibs-timers@0.2.0",
        "url": "npm:jspm-nodelibs-url@0.2.0",
        "util": "npm:jspm-nodelibs-util@0.2.0",
        "vm": "npm:jspm-nodelibs-vm@0.2.0",
        "zone.js": "npm:zone.js@0.7.2"
    },
    packages: {
        "npm:crypto-browserify@3.11.0": {
            "map": {
                "browserify-cipher": "npm:browserify-cipher@1.0.0",
                "create-hash": "npm:create-hash@1.1.2",
                "create-hmac": "npm:create-hmac@1.1.4",
                "create-ecdh": "npm:create-ecdh@4.0.0",
                "diffie-hellman": "npm:diffie-hellman@5.0.2",
                "randombytes": "npm:randombytes@2.0.3",
                "public-encrypt": "npm:public-encrypt@4.0.0",
                "inherits": "npm:inherits@2.0.3",
                "pbkdf2": "npm:pbkdf2@3.0.9",
                "browserify-sign": "npm:browserify-sign@4.0.0"
            }
        },
        "npm:create-hmac@1.1.4": {
            "map": {
                "create-hash": "npm:create-hash@1.1.2",
                "inherits": "npm:inherits@2.0.3"
            }
        },
        "npm:create-hash@1.1.2": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "cipher-base": "npm:cipher-base@1.0.3",
                "ripemd160": "npm:ripemd160@1.0.1",
                "sha.js": "npm:sha.js@2.4.8"
            }
        },
        "npm:public-encrypt@4.0.0": {
            "map": {
                "create-hash": "npm:create-hash@1.1.2",
                "randombytes": "npm:randombytes@2.0.3",
                "bn.js": "npm:bn.js@4.11.6",
                "browserify-rsa": "npm:browserify-rsa@4.0.1",
                "parse-asn1": "npm:parse-asn1@5.0.0"
            }
        },
        "npm:diffie-hellman@5.0.2": {
            "map": {
                "randombytes": "npm:randombytes@2.0.3",
                "bn.js": "npm:bn.js@4.11.6",
                "miller-rabin": "npm:miller-rabin@4.0.0"
            }
        },
        "npm:pbkdf2@3.0.9": {
            "map": {
                "create-hmac": "npm:create-hmac@1.1.4"
            }
        },
        "npm:browserify-cipher@1.0.0": {
            "map": {
                "browserify-des": "npm:browserify-des@1.0.0",
                "browserify-aes": "npm:browserify-aes@1.0.6",
                "evp_bytestokey": "npm:evp_bytestokey@1.0.0"
            }
        },
        "npm:browserify-sign@4.0.0": {
            "map": {
                "create-hash": "npm:create-hash@1.1.2",
                "create-hmac": "npm:create-hmac@1.1.4",
                "inherits": "npm:inherits@2.0.3",
                "elliptic": "npm:elliptic@6.3.3",
                "bn.js": "npm:bn.js@4.11.6",
                "browserify-rsa": "npm:browserify-rsa@4.0.1",
                "parse-asn1": "npm:parse-asn1@5.0.0"
            }
        },
        "npm:create-ecdh@4.0.0": {
            "map": {
                "elliptic": "npm:elliptic@6.3.3",
                "bn.js": "npm:bn.js@4.11.6"
            }
        },
        "npm:browserify-des@1.0.0": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "cipher-base": "npm:cipher-base@1.0.3",
                "des.js": "npm:des.js@1.0.0"
            }
        },
        "npm:browserify-aes@1.0.6": {
            "map": {
                "create-hash": "npm:create-hash@1.1.2",
                "inherits": "npm:inherits@2.0.3",
                "cipher-base": "npm:cipher-base@1.0.3",
                "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
                "buffer-xor": "npm:buffer-xor@1.0.3"
            }
        },
        "npm:evp_bytestokey@1.0.0": {
            "map": {
                "create-hash": "npm:create-hash@1.1.2"
            }
        },
        "npm:cipher-base@1.0.3": {
            "map": {
                "inherits": "npm:inherits@2.0.3"
            }
        },
        "npm:browserify-rsa@4.0.1": {
            "map": {
                "randombytes": "npm:randombytes@2.0.3",
                "bn.js": "npm:bn.js@4.11.6"
            }
        },
        "npm:miller-rabin@4.0.0": {
            "map": {
                "bn.js": "npm:bn.js@4.11.6",
                "brorand": "npm:brorand@1.0.7"
            }
        },
        "npm:parse-asn1@5.0.0": {
            "map": {
                "browserify-aes": "npm:browserify-aes@1.0.6",
                "create-hash": "npm:create-hash@1.1.2",
                "evp_bytestokey": "npm:evp_bytestokey@1.0.0",
                "pbkdf2": "npm:pbkdf2@3.0.9",
                "asn1.js": "npm:asn1.js@4.9.1"
            }
        },
        "npm:des.js@1.0.0": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
            }
        },
        "npm:hash.js@1.0.3": {
            "map": {
                "inherits": "npm:inherits@2.0.3"
            }
        },
        "npm:buffer@4.9.1": {
            "map": {
                "base64-js": "npm:base64-js@1.2.0",
                "isarray": "npm:isarray@1.0.0",
                "ieee754": "npm:ieee754@1.1.8"
            }
        },
        "npm:stream-browserify@2.0.1": {
            "map": {
                "inherits": "npm:inherits@2.0.3",
                "readable-stream": "npm:readable-stream@2.2.3"
            }
        },
        "npm:timers-browserify@1.4.2": {
            "map": {
                "process": "npm:process@0.11.9"
            }
        },
        "github:twbs/bootstrap@3.3.7": {
            "map": {
                "jquery": "npm:jquery@3.1.1"
            }
        },
        "npm:rxjs@5.0.0-beta.12": {
            "map": {
                "symbol-observable": "npm:symbol-observable@1.0.4"
            }
        },
        "npm:jspm-nodelibs-buffer@0.2.0": {
            "map": {
                "buffer-browserify": "npm:buffer@4.9.1"
            }
        },
        "npm:jspm-nodelibs-os@0.2.0": {
            "map": {
                "os-browserify": "npm:os-browserify@0.2.1"
            }
        },
        "npm:jspm-nodelibs-string_decoder@0.2.0": {
            "map": {
                "string_decoder-browserify": "npm:string_decoder@0.10.31"
            }
        },
        "npm:jspm-nodelibs-stream@0.2.0": {
            "map": {
                "stream-browserify": "npm:stream-browserify@2.0.1"
            }
        },
        "npm:jspm-nodelibs-crypto@0.2.0": {
            "map": {
                "crypto-browserify": "npm:crypto-browserify@3.11.0"
            }
        },
        "npm:jspm-nodelibs-timers@0.2.0": {
            "map": {
                "timers-browserify": "npm:timers-browserify@1.4.2"
            }
        },
        "npm:ng2-smart-table@0.4.0-3": {
            "map": {
                "rxjs": "npm:rxjs@5.0.0-beta.12"
            }
        },
        "npm:sha.js@2.4.8": {
            "map": {
                "inherits": "npm:inherits@2.0.3"
            }
        },
        "npm:font-awesome@4.7.0": {
            "map": {
                "css": "github:systemjs/plugin-css@0.1.32"
            }
        },
        "npm:errno@0.1.4": {
            "map": {
                "prr": "npm:prr@0.0.0"
            }
        },
        "npm:mkdirp@0.5.1": {
            "map": {
                "minimist": "npm:minimist@0.0.8"
            }
        },
        "npm:promise@7.1.1": {
            "map": {
                "asap": "npm:asap@2.0.5"
            }
        },
        "npm:jspm-nodelibs-domain@0.2.0": {
            "map": {
                "domain-browserify": "npm:domain-browser@1.1.7"
            }
        },
        "npm:jspm-nodelibs-url@0.2.0": {
            "map": {
                "url-browserify": "npm:url@0.11.0"
            }
        },
        "npm:url@0.11.0": {
            "map": {
                "punycode": "npm:punycode@1.3.2",
                "querystring": "npm:querystring@0.2.0"
            }
        },
        "npm:rxjs@5.0.0-rc.4": {
            "map": {
                "symbol-observable": "npm:symbol-observable@1.0.4"
            }
        },
        "npm:asn1.js@4.9.1": {
            "map": {
                "bn.js": "npm:bn.js@4.11.6",
                "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
                "inherits": "npm:inherits@2.0.3"
            }
        },
        "npm:ng2-bootstrap@1.3.3": {
            "map": {
                "moment": "npm:moment@2.17.1"
            }
        },
        "npm:elliptic@6.3.3": {
            "map": {
                "bn.js": "npm:bn.js@4.11.6",
                "inherits": "npm:inherits@2.0.3",
                "hash.js": "npm:hash.js@1.0.3",
                "brorand": "npm:brorand@1.0.7"
            }
        },
        "npm:readable-stream@2.2.3": {
            "map": {
                "isarray": "npm:isarray@1.0.0",
                "inherits": "npm:inherits@2.0.3",
                "string_decoder": "npm:string_decoder@0.10.31",
                "process-nextick-args": "npm:process-nextick-args@1.0.7",
                "core-util-is": "npm:core-util-is@1.0.2",
                "util-deprecate": "npm:util-deprecate@1.0.2",
                "buffer-shims": "npm:buffer-shims@1.0.0"
            }
        }
    }
});
