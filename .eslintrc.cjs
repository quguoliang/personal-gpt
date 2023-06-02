module.exports = {
    extends: [

        "plugin:astro/recommended",
    ],
    overrides: [
        {
            "files": ["*.astro"],
            "parser": "astro-eslint-parser",
            "parserOptions": {
                "parser": "@typescript-eslint/parser",
                "extraFileExtensions": [".astro"]
            },
            "rules": {
                "max-lines-per-function": 1,
                "@typescript-eslint/comma-dangle": ["error"],
                "@typescript-eslint/array-type": [
                    "warn",
                    { "default": "array-simple", "read-only": "array-simple" }
                ],
                "@typescript-eslint/ban-types": [
                    "error",
                    {
                        "types": {
                            "Foo": "Don't use Foo because it is unsafe",
                            "OldAPI": {
                                "message": "Use NewAPI instead",
                                "fixWith": "NewAPI"
                            },
                            "{}": false
                        },
                        "extendDefaults": true
                    }
                ],

                "@typescript-eslint/naming-convention": [
                    "warn",
                    {
                        "selector": "interface",
                        "format": ["PascalCase"],
                        "custom": {
                            "regex": "^I[A-Z]",
                            "match": true
                        }
                    }
                ],
                "import/order": [
                    "error",
                    {
                        "groups": [
                            "external",
                            "builtin",
                            "parent",
                            ["internal", "sibling", "index"],
                            "unknown"
                        ],
                        "pathGroups": [
                            {
                                "pattern": "@src/**",
                                "group": "external",
                                "position": "after"
                            },
                            {
                                "pattern": "@src/**",
                                "group": "unknown",
                                "position": "after"
                            }
                        ]
                    }
                ],
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/method-signature-style": ["warn"],
                "@typescript-eslint/prefer-for-of": "warn",
                "@typescript-eslint/prefer-optional-chain": "warn",
                "@typescript-eslint/no-empty-interface": [
                    "error",
                    {
                        "allowSingleExtends": false
                    }
                ],
                "@typescript-eslint/no-inferrable-types": "error",
                "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
                "@typescript-eslint/explicit-function-return-type": "off"
            }
        }
    ],
}