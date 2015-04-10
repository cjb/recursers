Package.describe({
  summary: "Login service for Recurse Center accounts",
  version: "1.0.4"
});

Package.onUse(function(api) {
  api.use('accounts-base', ['client', 'server']);
  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);
  api.use('accounts-oauth', ['client', 'server']);
  api.use('recursecenter', ['client', 'server']);

  api.addFiles('recursecenter_login_button.css', 'client');

  api.addFiles("recursecenter.js");
});
