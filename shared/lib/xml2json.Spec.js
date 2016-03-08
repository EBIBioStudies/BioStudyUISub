var xml2json = require('./xml2json');

var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><responseWrapper><version>4.3</version><hitCount>1</hitCount><request><query>ext_id:78184</query><resultType>lite</resultType><synonym>false</synonym><page>1</page><pageSize>25</pageSize></request><resultList><result><id>78184</id><source>MED</source><pmid>78184</pmid><title>Pancreatic supplementation for premature babies.</title><authorString>Robinson PG, Elliott RB.</authorString><journalTitle>Lancet</journalTitle><issue>7939</issue><journalVolume>2</journalVolume><pubYear>1975</pubYear><journalIssn>0140-6736</journalIssn><pageInfo>817-818</pageInfo><pubType>letter</pubType><inEPMC>N</inEPMC><inPMC>N</inPMC><citedByCount>2</citedByCount><hasReferences>N</hasReferences><hasTextMinedTerms>N</hasTextMinedTerms><hasDbCrossReferences>N</hasDbCrossReferences><hasLabsLinks>N</hasLabsLinks><hasTMAccessionNumbers>N</hasTMAccessionNumbers><luceneScore>17565.654</luceneScore><hasBook>N</hasBook></result></resultList></responseWrapper>';

describe('Test model Attribute', function() {

    beforeEach(function () {

    });

    it('should convert xml to json', function() {
        var x2js = new xml2json();
        console.log(x2js.xml_str2json(xml));
    });
});
