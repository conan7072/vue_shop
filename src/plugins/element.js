import Vue from 'vue'
import {Button,Form,FormItem,Input,Message} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//message的配置和其他的不太一样，需要挂载到全局
Vue.prototype.$message = Message
