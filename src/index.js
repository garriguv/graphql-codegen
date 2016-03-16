import {
  graphql
} from 'graphql';

import {
  buildClientSchema,
  printSchema
} from 'graphql/utilities';

import {
  Source,
  parse,
  visit
} from 'graphql/language';

import {
  readFile
} from 'fs';

function readIntrospectionQuery() {
  return new Promise( function (resolve, reject) {
    readFile('src/resources/introspection_schema.json', 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

function readQuery(queryName) {
  return new Promise( function (resolve, reject) {
    readFile('src/resources/' + queryName + '.graphql', 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function generateSchema(introspectionQuery) {
  return new Promise( function (resolve) {
    resolve(buildClientSchema(introspectionQuery.data));
  });
}

function executeQuery(schema, request, variables) {
  return new Promise( function (resolve) {
    resolve(graphql(schema, request, null, variables));
  });
}

readIntrospectionQuery()
  .then(generateSchema)
  .then(function(schema) {
    console.log(printSchema(schema));
    return readQuery('query').then(function(query){
      var source = new Source(query, 'GraphQL request');
      var documentAst = parse(source);
      console.log(documentAst);
      visit(documentAst, {
        enter(node) { //node, key, parent, path, ancestors
          console.log(['enter', node, node.kind, node.value]);
        },
        leave(node) { //node, key, parent, path, ancestors
          console.log(['enter', node, node.kind, node.value]);
        }
      });
      return executeQuery(schema, query, {});
    });
  })
  .then(function(wat) {
    console.log(wat);
  });

  // return new Promise( function (resolve, reject) {
  //   readFile(cachePath, 'utf8', function (err, data) {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(JSON.parse(data));
  //   });
  // }
