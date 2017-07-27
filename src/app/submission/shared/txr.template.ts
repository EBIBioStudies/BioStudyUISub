export const TxRTemplate = {
    "sectionType": {
        "name": "Study",
        "required": true,
        "maxcount": 1,
        "fieldTypes": [
            {
                "name": "Method name",
                "valueType": "textline",
                "placeholder": "e.g. UKN3b_NeuroTox_LUH_neurite_24h_d5",
                "required": true
            },
            {
                "name": "Project part",
                "valueType": "textline",
                "placeholder": "e.g. CSY",
                "required": true
            },
            {
                "name": "Toxicity domain",
                "valueType": "textline",
                "placeholder": "e.g. DART",
                "required": true
            },
            {
                "name": "Title",
                "valueType": "textline",
                "placeholder": "e.g. testing on neurite effects in the context of cross-systems testing",
                "required": true
            },
            {
                "name": "Organism",
                "valueType": "textline",
                "placeholder": "e.g. human",
                "required": true,
            },
            {
                "name": "Organ",
                "valueType": "textline",
                "placeholder": "e.g. brain",
                "required": true
            },
            {
                "name": "Cell type",
                "valueType": "textline",
                "placeholder": "e.g. cell line",
                "required": true
            },
            {
                "name": "Cell name",
                "valueType": "textline",
                "placeholder": "e.g. LUHMES",
                "required": true
            },
            {
                "name": "Treatment modality",
                "valueType": "textline",
                "placeholder": "e.g. single dose",
                "required": true
            },
            {
                "name": "Information domain",
                "valueType": "textline",
                "placeholder": "e.g. cytotoxicity",
                "required": true
            },
            {
                "name": "Exposure time",
                "valueType": "textline",
                "placeholder": "e.g. 24 h",
                "required": true
            },
            {
                "name": "Test endpoint 1",
                "valueType": "textline",
                "placeholder": "e.g. viability",
                "required": true
            },
            {
                "name": "Endpoint 1 analytical measure",
                "valueType": "textline",
                "placeholder": "e.g. imaging",
                "required": true
            },
            {
                "name": "Test endpoint 2",
                "valueType": "textline",
                "placeholder": "e.g. neurite outgrowth",
                "required": true
            },
            {
                "name": "Endpoint 2 analytical measure",
                "valueType": "textline",
                "placeholder": "e.g. imaging",
                "required": true
            },
            {
                "name": "Compound",
                "valueType": "textline",
                "required": true
            }
        ],
        "featureTypes": [
            {
                "name": "Contact",
                "required": true,
                "columnTypes": [
                    {
                        "name": "Name",
                        "valueType": "textline"
                    },
                    {
                        "name": "E-mail",
                        "valueType": "textline"
                    },
                    {
                        "name": "Role",
                        "valueType": "textline"
                    },
                    {
                        "name": "Organisation",
                        "valueType": "textline"
                    }
                ]
            },
            {
                "name": "File",
                "required": true,
                "columnTypes": [
                    {
                        "name": "Path",
                        "valueType": "file",
                        "required": true
                    }
                ]
            }


        ]
    }
};
