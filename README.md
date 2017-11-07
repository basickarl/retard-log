Due to the retardedness of some of the libraries not providing a *simple* human readable logging library, which can log to file and stdout, I had to tell someone to hold my beer so I could.
```
const retardlog = require('retardlog');

const log = retardlog.create([
    {
        type: 'file',
        path: 'logs/foo2.log',
    },
    {
        type: 'console'
    }
]);

log.error(new Error('F*ck'));
log.warn('This is a warning');
log.info('God');
log.debug('k.');
log.trace('Yea you get the picture');
```
Will result in the following:
```
2017-11-07 15:43:39 UTC+1  ERROR Error: F*ck
    at Object.<anonymous> (/Users/karl/dev/retardlog/index.js:152:11)
    at Module._compile (module.js:641:30)
    at Object.Module._extensions..js (module.js:652:10)
    at Module.load (module.js:560:32)
    at tryModuleLoad (module.js:503:12)
    at Function.Module._load (module.js:495:3)
    at Function.Module.runMain (module.js:682:10)
    at startup (bootstrap_node.js:191:16)
    at bootstrap_node.js:613:3
2017-11-07 15:43:39 UTC+1   WARN This is a warning
2017-11-07 15:43:39 UTC+1   INFO God
2017-11-07 15:43:39 UTC+1  DEBUG k.
2017-11-07 15:43:39 UTC+1  TRACE Yea you get the picture
```
No you cannot set options to edit stuff. This is it. You want to customise your logging or have advanced stuff. Go find another library. This has only been tested on Linux/MAC. No Windows, no.
