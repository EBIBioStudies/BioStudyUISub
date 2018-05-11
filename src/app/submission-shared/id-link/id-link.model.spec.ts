import {IdLinkModel} from './id-link.model';

describe('IdLinkModel', () => {
  it('has undefined properties by default', () => {
    const model = new IdLinkModel();
    expect(model.url).toBeUndefined();
    expect(model.prefix).toBeUndefined();
    expect(model.id).toBeUndefined();

    const value = model.asValue();
    expect(value.url).toBeUndefined();
    expect(value.prefix).toBeUndefined();
    expect(value.id).toBeUndefined();
  });

  it('returns an empty string if all fields are undefined', () => {
    const model = new IdLinkModel();
    expect(model.asString()).toEqual('');
  });

  it('returns a prefix string when id and url parts are undefined', () => {
    const prefix = 'chebi';
    const model = new IdLinkModel();
    model.updateValues({prefix: prefix});
    expect(model.asString()).toEqual('chebi');
  });

  it('can be updated with an [prefix]:[id] string', () => {
    const model = new IdLinkModel();
    const [prefix, id] = ['chebi', '123'];
    const input = `${prefix}:${id}`;
    model.update(input);
    expect(model.asString()).toEqual(input);
    expect(model.prefix).toEqual(prefix);
    expect(model.id).toEqual(id);
    expect(model.url).toBeUndefined();
  });

  it('can be updated with an URL string', () => {
    const model = new IdLinkModel();
    const input = 'http://www.example.com/123';
    model.update(input);
    expect(model.asString()).toEqual(input);
    expect(model.prefix).toBeUndefined();
    expect(model.id).toBeUndefined();
    expect(model.url).toEqual(input);
  });

  it('keeps colon between prefix and id', () => {
    const model = new IdLinkModel();
    model.update('chebi:');
    expect(model.asString()).toEqual('chebi:');
    expect(model.id).toBeUndefined();

    model.update('chebi');
    expect(model.asString()).toEqual('chebi');
    expect(model.id).toBeUndefined();
  });
});
