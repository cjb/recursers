Package.describe({
  summary: "Recurse Center OAuth flow",
  version: "1.1.3"
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Recursecenter');

  api.addFiles(
    ['recursecenter_configure.html', 'recursecenter_configure.js'],
    'client');

  api.addFiles('recursecenter_server.js', 'server');
  api.addFiles('recursecenter_client.js', 'client');
});
