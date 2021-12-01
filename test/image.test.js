'use strict';

const mock = require('egg-mock');

describe('test/image.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/image-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, image')
      .expect(200);
  });
});
