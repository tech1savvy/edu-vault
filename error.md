PS D:\work\edu-vault\server> nodemon index.js
[nodemon] 3.1.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
[dotenv@17.2.3] injecting env (5) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
node:internal/modules/cjs/loader:1146
  throw err;
  ^

Error: Cannot find module 'pool'
Require stack:
- D:\work\edu-vault\server\features\user\user.model.js
- D:\work\edu-vault\server\features\auth\auth.js
- D:\work\edu-vault\server\features\auth\auth.handlers.js
- D:\work\edu-vault\server\features\auth\auth.routes.js
- D:\work\edu-vault\server\features\auth\index.js
- D:\work\edu-vault\server\routes.js
- D:\work\edu-vault\server\app.js
- D:\work\edu-vault\server\index.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1143:15)
    at Module._load (node:internal/modules/cjs/loader:984:27)
    at Module.require (node:internal/modules/cjs/loader:1231:19)
    at require (node:internal/modules/helpers:179:18)
    at Object.<anonymous> (D:\work\edu-vault\server\features\user\user.model.js:1:14)
    at Module._compile (node:internal/modules/cjs/loader:1369:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1427:10)
    at Module.load (node:internal/modules/cjs/loader:1206:32)
    at Module._load (node:internal/modules/cjs/loader:1022:12)
    at Module.require (node:internal/modules/cjs/loader:1231:19) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    'D:\\work\\edu-vault\\server\\features\\user\\user.model.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\auth.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\auth.handlers.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\auth.routes.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\index.js',
    'D:\\work\\edu-vault\\server\\routes.js',
    'D:\\work\\edu-vault\\server\\app.js',
    'D:\\work\\edu-vault\\server\\index.js'
  ]
}

Node.js v20.12.1
[nodemon] app crashed - waiting for file changes before starting...
[nodemon] restarting due to changes...
[nodemon] starting `node index.js`
[nodemon] restarting due to changes...
[dotenv@17.2.3] injecting env (5) from .env -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
node:internal/modules/cjs/loader:1146
  throw err;
  ^

Error: Cannot find module 'pool'
Require stack:
- D:\work\edu-vault\server\features\user\user.model.js
- D:\work\edu-vault\server\features\auth\auth.js
- D:\work\edu-vault\server\features\auth\auth.handlers.js
- D:\work\edu-vault\server\features\auth\auth.routes.js
- D:\work\edu-vault\server\features\auth\index.js
- D:\work\edu-vault\server\routes.js
- D:\work\edu-vault\server\app.js
- D:\work\edu-vault\server\index.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1143:15)
    at Module._load (node:internal/modules/cjs/loader:984:27)
    at Module.require (node:internal/modules/cjs/loader:1231:19)
    at require (node:internal/modules/helpers:179:18)
    at Object.<anonymous> (D:\work\edu-vault\server\features\user\user.model.js:1:14)
    at Module._compile (node:internal/modules/cjs/loader:1369:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1427:10)
    at Module.load (node:internal/modules/cjs/loader:1206:32)
    at Module._load (node:internal/modules/cjs/loader:1022:12)
    at Module.require (node:internal/modules/cjs/loader:1231:19) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    'D:\\work\\edu-vault\\server\\features\\user\\user.model.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\auth.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\auth.handlers.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\auth.routes.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\index.js',
    'D:\\work\\edu-vault\\server\\routes.js',
    'D:\\work\\edu-vault\\server\\app.js',
    'D:\\work\\edu-vault\\server\\index.js'
  ]
}

Node.js v20.12.1
[nodemon] starting `node index.js`
[dotenv@17.2.3] injecting env (5) from .env -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
node:internal/modules/cjs/loader:1146
  throw err;
  ^

Error: Cannot find module 'pool'
Require stack:
- D:\work\edu-vault\server\features\user\user.model.js
- D:\work\edu-vault\server\features\auth\auth.js
- D:\work\edu-vault\server\features\auth\auth.handlers.js
- D:\work\edu-vault\server\features\auth\auth.routes.js
- D:\work\edu-vault\server\features\auth\index.js
- D:\work\edu-vault\server\routes.js
- D:\work\edu-vault\server\app.js
- D:\work\edu-vault\server\index.js
    at Module._resolveFilename (node:internal/modules/cjs/loader:1143:15)
    at Module._load (node:internal/modules/cjs/loader:984:27)
    at Module.require (node:internal/modules/cjs/loader:1231:19)
    at require (node:internal/modules/helpers:179:18)
    at Object.<anonymous> (D:\work\edu-vault\server\features\user\user.model.js:1:14)
    at Module._compile (node:internal/modules/cjs/loader:1369:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1427:10)
    at Module.load (node:internal/modules/cjs/loader:1206:32)
    at Module._load (node:internal/modules/cjs/loader:1022:12)
    at Module.require (node:internal/modules/cjs/loader:1231:19) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    'D:\\work\\edu-vault\\server\\features\\user\\user.model.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\auth.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\auth.handlers.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\auth.routes.js',
    'D:\\work\\edu-vault\\server\\features\\auth\\index.js',
    'D:\\work\\edu-vault\\server\\routes.js',
    'D:\\work\\edu-vault\\server\\app.js',
    'D:\\work\\edu-vault\\server\\index.js'
  ]
}

Node.js v20.12.1
[nodemon] app crashed -