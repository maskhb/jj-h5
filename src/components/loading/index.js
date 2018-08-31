import { Loading } from 'vux'
import Vue from 'vue'
let $vm
if (!$vm) {
  $vm = createVM(Vue)
}

function createVM (Vue) {
  const Alert = Vue.extend(Loading)
  const $vm = new Alert({
    el: document.createElement('div')
  })
  document.body.appendChild($vm.$el)
  return $vm
}

export function show () {
  $vm.show = true
}

export function hide () {
  $vm.show = false
}

export default {
  show,
  hide
}
