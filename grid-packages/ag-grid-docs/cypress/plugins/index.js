/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const fs = require('fs');
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  config.env.examples = getExamples();
  return config;
}

function getExamples() {
  const basePath = './documentation/doc-pages/'
  var files = fs.readdirSync(basePath);
  var pageGps = [];

  files.forEach(f => {
    const exampleDir = basePath + f + '/examples/';
    if (fs.existsSync(exampleDir)) {
      const examples = fs.readdirSync(exampleDir);
      let exSet = [];
      examples.forEach(ex => {
        const exFolder = exampleDir + '/' + ex;
        const importTypes = ['modules', 'packages'];
        let genExp = [];
        importTypes.forEach(i => {
          const iExs = `${exFolder}/_gen/${i}/`
          if (fs.existsSync(iExs)) {
            genExp.push({ type: i, frameworks: fs.readdirSync(iExs) });
          }
        })
        exSet.push({ example: ex, generated: genExp })
      })

      pageGps.push({ page: f, examples: exSet })

    }
  })

  return pageGps;
}
