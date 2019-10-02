;('use strict')

const fs = require('fs')
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const ini = require('ini')
const generator = require('generate-password')
const pluralize = require('pluralize')
const camelCase = require('lodash').camelCase

let config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

const camelToTitle = camelCase =>
  camelCase
    .replace(/([A-Z])/g, match => ` ${match}`)
    .replace(/^./, match => match.toUpperCase())
    .trim()

function injectFileBefore(file, find, content) {
  console.log('injectFileBefore', file, find, content)
  let fileContent = fs.readFileSync(file, 'utf-8')
  let line = find + '\n'

  let result = fileContent.replace(line, content + '\n' + line)

  fs.writeFileSync(file, result, 'utf8')
  return null
}

module.exports = class extends Generator {
  readConfigs() {
    let config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
    return config
  }

  prompting() {
    // Have Yeoman greet the user.
    // this.options  - from --xyz=value
    this.props = {}
    if (process.argv.length < 4) {
      this.log(
        yosay(
          `Generate crud ${chalk.red(
            'generator-nuxtadm'
          )} tablename(plural) field1:inputType [field2:inputType...]`
        )
      )
      this.log(yosay(`inputTypes: text,textarea,radio,select,tag,static`))
      return
    }
    console.log('args', process.argv.slice(3))
    let args = process.argv.slice(3)
    let table = args[0]
    this.props.table = table
    let fields = []
    for (let c = 1; c < args.length; c++) {
      let arg = args[c]
      if (arg == '--force') {
        continue // ignore
      }
      let values = arg.split(':')

      const name = values[0]
      const label = camelToTitle(name)

      let dataType = values[1]
      let jsType = values[1]
      switch (values[1]) {
        case 'date':
          jsType = 'Date'
        case 'datetime':
          jsType = 'Date'
        case 'object':
          jsType = 'any'
        case 'array':
          jsType = 'any[]'
      }
      const inputType = values.length > 2 ? values[2] : 'text'
      fields.push({
        name: name,
        uname: name[0].toUpperCase() + name.slice(1),
        label: label,
        dataType: dataType,
        jsType: jsType,
        inputType: inputType
      })
    }
    this.props.fields = fields

    let niceTable = camelToTitle(table)
    let singularTable = pluralize.singular(table).toLowerCase()
    let niceSingularTable = camelToTitle(singularTable)
    let camelSingularTable = camelCase(singularTable)
    let camelTable = camelCase(table)

    this.props.niceTableName = niceTable
    this.props.niceSingularTable = niceSingularTable
    this.props.singularClassName =
      camelSingularTable[0].toUpperCase() + camelSingularTable.slice(1)
    this.props.pluralClassName =
      camelTable[0].toUpperCase() + camelTable.slice(1)
    this.props.singularTable = singularTable
    // this.customConfig = this.readConfigs()
    // console.log('final props', props)
    // this.props = props
  }

  async writing() {
    //= =====BEGIN store =======//
    let destination = 'store/'
    let storeDestName = this.props.table
    console.log('writing index')
    let results = await Promise.all([
      this.fs.copyTpl(
        this.templatePath('stores/index.ts'),
        this.destinationPath('store/' + storeDestName + '/index.ts'),
        this.props
      ),
      this.fs.copyTpl(
        this.templatePath('stores/actions.ts'),
        this.destinationPath('store/' + storeDestName + '/actions.ts'),
        this.props
      ),
      this.fs.copyTpl(
        this.templatePath('stores/mutations.ts'),
        this.destinationPath('store/' + storeDestName + '/mutations.ts'),
        this.props
      ),
      this.fs.copyTpl(
        this.templatePath('stores/state.ts'),
        this.destinationPath('store/' + storeDestName + '/state.ts'),
        this.props
      )
    ])
    console.log('written...')

    await this.spawnCommand('node_modules/eslint/bin/eslint.js', [
      '--fix',
      this.destinationPath('store/' + storeDestName + '/*.*')
    ])
    //= =====END store =======//

    //= =====BEGIN admin pages =======//
    destination = 'pages/cp1/' + this.props.table

    await Promise.all([
      this.fs.copyTpl(
        this.templatePath('pages/admin/_id.html'),
        this.destinationPath(destination + '/_id.vue'),
        this.props
      ),
      this.fs.copyTpl(
        this.templatePath('pages/admin/index.html'),
        this.destinationPath(destination + '/index.vue'),
        this.props
      )
    ])

    await this.spawnCommand('node_modules/eslint/bin/eslint.js', [
      '--fix',
      this.destinationPath(destination + '/*')
    ])
    //= =====END admin pages =======//

    //= =====BEGIN functions =======//
    destination = 'functions/'

    await Promise.all([
      this.fs.copyTpl(
        this.templatePath('firebase/triggers.ts'),
        this.destinationPath(
          destination + '/trigger' + this.props.pluralClassName + '.ts'
        ),
        this.props
      )
      // this.fs.copyTpl(
      //   this.templatePath('stitch/fetch.js'),
      //   this.destinationPath(
      //     destination + '/fetch' + this.props.singularClassName + '.ts'
      //   ),
      //   this.props
      // )
    ])

    await this.spawnCommand('node_modules/eslint/bin/eslint.js', [
      '--fix',
      this.destinationPath(destination + '/*')
    ])
    //= =====END functions =======//

    // let destination = this.props.project_name
    // this.customConfig.counter.ssh = parseInt(this.customConfig.counter.ssh) + 10
    // this.props.customConfig = this.customConfig
    // this.fs.copy(
    //   this.templatePath('authorized_keys'),
    //   this.destinationPath(destination + '/authorized_keys'),
    //   this.props
    // )

    // Update configuration
    // fs.writeFileSync('./config.ini', ini.stringify(this.customConfig))
  }

  // Install() {
  //   this.installDependencies();
  // }
}
