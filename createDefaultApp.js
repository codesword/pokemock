var express = require( 'express' );
var pokemock = require( './' );
var generate = pokemock.generate;
var generate2 = pokemock.generate2;

module.exports = createDefaultApp;

function createDefaultApp( api, options ) {

  options = options || {};
  var app = express();

  var forceSSL = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'http') {
      return res.redirect(301, ['https://', req.get('Host'), req.url].join(''));
    }
    return next();
  };
  app.get('/', function (req, res) {
    res.json({});
  });

  app.get('/healthz', function (req, res) {
    res.json({});
  });

  app.get('/.well-known/acme-challenge/_selftest', (req, res) => {
    res.json({});
  });

  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(forceSSL);
  }

  app.get( '/api-docs', pokemock.apiDocs( api ) );
  app.use( '/ui', pokemock.ui );

  if ( options.killable ) app.use( '/kill', pokemock.kill );

  app.use(
    pokemock.swagger( api, app ),
    pokemock.replay(),
    pokemock.chance,
    pokemock.time,
    pokemock.status,
    pokemock.mock( [
      generate.id,
      generate2.birthday,
      generate2.email,
      generate2.url,
      generate2.phone,
      generate2.city,
      generate2.country,
      generate2.street,
      generate2.zip,
      generate2.houseNo,
      generate2.prefix,
      generate2.first,
      generate2.last,
      generate2.description,
      generate2.summary,
      generate2.label,
      generate2.price,
      generate2.created_at,
      generate2.updated_at,
      generate.string,
      generate.number,
      generate.integer,
      generate.boolean,
      generate.array,
      generate.object
    ] ),
    pokemock.override,
    pokemock.classify,
    pokemock.memory( options ),
    pokemock.send,
    pokemock.notFound,
    pokemock.sendError
  );

  return app;

}
