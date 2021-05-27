import moment from 'moment'
import '../styles/main.scss'

if (module.hot) {
  module.hot.accept() // already had this init code

  module.hot.addStatusHandler(status => {
    if (status === 'prepare') console.clear()
  })
}

console.log(moment().format())
