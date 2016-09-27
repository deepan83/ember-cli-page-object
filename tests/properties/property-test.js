import { moduleForProperty } from '../helpers/properties';
import { create, property } from 'ember-cli-page-object';

moduleForProperty('property', function(test, adapter) {
  test('returns property value', function(assert) {
    let page = create({
      foo: property('checked', ':input')
    });

    adapter.createTemplate(this, page, '<input type="checkbox" checked>');

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: property('checked', ':input')
          }
        }
      }
    });

    adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('looks for elements inside the scope', function(assert) {
    let page = create({
      foo: property('checked', ':input', { scope: '.scope' })
    });

    adapter.createTemplate(this, page, `
      <div><input></div>
      <div class="scope"><input checked></div>
      <div><input></div>
    `);

    assert.ok(page.foo);
  });

  test("looks for elements inside page's scope", function(assert) {
    let page = create({
      scope: '.scope',

      foo: property('checked', ':input')
    });

    adapter.createTemplate(this, page, `
      <div><input></div>
      <div class="scope"><input checked></div>
      <div><input></div>
    `);

    assert.ok(page.foo);
  });

  test('resets scope', function(assert) {
    let page = create({
      scope: '.scope',

      foo: property('checked', ':input', { resetScope: true })
    });

    adapter.createTemplate(this, page, `
      <div class="scope"></div>
      <div><input checked></div>
    `);

    assert.ok(page.foo);
  });

  test("raises an error when the element doesn't exist", function(assert) {
    let page = create({
      foo: {
        bar: {
          baz: {
            qux: property('checked', ':input')
          }
        }
      }
    });

    adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.baz.qux, /page\.foo\.bar\.baz\.qux/);
  });

  test('throws error if selector matches more than one element', function(assert) {
    let page = create({
      foo: property('checked', ':input')
    });

    adapter.createTemplate(this, page, `
      <input checked>
      <input checked>
    `);

    assert.throws(() => page.foo,
      /matched more than one element. If this is not an error use { multiple: true }/);
  });

  test('matches multiple elements', function(assert) {
    let page = create({
      foo: property('checked', ':input', { multiple: true })
    });

    adapter.createTemplate(this, page, `
      <input input="checkbox" checked>
      <input input="checkbox" >
    `);

    assert.deepEqual(page.foo, [true, false]);
  });

  test('finds element by index', function(assert) {
    let page = create({
      foo: property('checked', ':input', { at: 1 })
    });

    adapter.createTemplate(this, page, `
      <input>
      <input checked>
    `);

    assert.ok(page.foo);
  });

  test('looks for elements outside the testing container', function(assert) {
    let page = create({
      foo: property('checked', ':input', { testContainer: '#alternate-ember-testing' })
    });

    adapter.createTemplate(this, page, '<input checked>', { useAlternateContainer: true });

    assert.ok(page.foo);
  });

  test('looks for elements within test container specified at node level', function(assert) {
    let page = create({
      testContainer: '#alternate-ember-testing',
      foo: property('checked', ':input')
    });

    adapter.createTemplate(this, page, '<input checked>', { useAlternateContainer: true });

    assert.ok(page.foo);
  });
});
