/*
  vue-console 1.0.0
  https://github.com/baram204/vue-console
  By JIHOON YI <baram204@gmail.com>
  Forked from https://github.com/onexdata/vue-console

  Based on console.js 1.2.2 (pre-React)

  Apache 2.0 License.

  Usage:

  * In your app:

  import console from 'vue-console'
  Vue.use(console)

  * Custom settings:
  <v-console settings="yourSettingsHere" />

  * On any of your other vue components:

  commands: {
    support () {
      // Do stuff here to initially setup your command
      return {
        // Guide is what shows up in the help system
        guide: 'Contact a client speciailist',
        // command is what gets executed when they type the command
        command () {
          // return is what is finally sent back to the console as output
          return 'Contacting a client solutions specialist, hold on...'
        }
      }
    },
    reboot () {
      return {
        guide: 'Restarts the program',
        command () {
          setTimeout(function () { location.reload() }, 1000)
          return '<span style="color: red">Rebooting...</span>'
        }
      }
    }
  }
 */

import consoleComponent from './console'

export default {
  install (Vue, options) {
    Vue.prototype.$console = {
      commands: []
    }

    Vue.mixin({
      beforeMount () {
        // This registers new commands found on each component in your apps...
        function register (name, payload, instance) {
          // Run the payload to set up the command and get it's guide and function...
          var config = payload.bind(instance)()
          name = name.toLowerCase()
          console.log(name, config)
          instance.$console.commands[name] = {guide: config.guide, command: config.command.bind(instance)}
        }

        // Go through each component in the app and register all commands...
        let commands = this.$options.commands
        if (commands) {
          let name = this.$options.name
          if (!name) console.warn('vue-console: All components should all be named. Failing to do so will result in difficulty debugging later.')
          Object.keys(commands).forEach(command => register(command, this.$options.commands[command], this))
        }
      }
    })

    Vue.component('v-console', consoleComponent)
  }
}
