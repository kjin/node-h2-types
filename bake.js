const { readFileSync, writeFileSync } = require('fs')
const { execSync } = require('child_process')

const dts = readFileSync('index.d.ts', 'utf8')
  .split('\n')
  .map(line => {
    const matches = line.match(/(\s+)\/\/\s\$\s(.*)/)
    if (!matches) {
      return line
    }
    const [_0, prefix, command] = matches
    const execResult = execSync(command, {
      encoding: 'utf8'
    })
    return execResult.trim().split('\n').map(l => `${prefix}${l}`).join('\n')
  })
  .join('\n')

writeFileSync('index.d.ts', dts, 'utf8')