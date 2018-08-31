class Config{
  constructor(props){
      this.conf = {
      isDebug:true,               // 打开后console所有请求结果
      envName: process.env.HT_ENV,                // 改变控制环境
      envs:{
        dev:{left:'dev.', right:'.hd', protocol:'http:', proxyStr:'ht-json-dev.hd/mj', olbProxyStr:'ht-json-dev.hd/1json'},
        test:{left:'ht-', right:'-test.htmimi.com', protocol:'http:', proxyStr:'ht-json-test.htmimi.com/mj', olbProxyStr:'ht-json-test.htmimi.com/1json'},
        beta:{left:'ht-', right:'-test.htmimi.com', protocol:'http:', proxyStr:'ht-json-test.htmimi.com/mj', olbProxyStr:'ht-json-test.htmimi.com/1json'},
        // test:{left:'ht-', right:'-test.hd', protocol:'http:', proxyStr:'test.web-proxy.hd/mj', olbProxyStr:'test.web-proxy.hd/1json'},
        // beta:{left:'ht-', right:'-test.hd', protocol:'http:', proxyStr:'test.web-proxy.hd/mj', olbProxyStr:'test.web-proxy.hd/1json'},
        fix:{left:'fix.', right:'.hd', protocol:'http:', proxyStr:'ht-json-fix.htmimi.com/mj', olbProxyStr:'ht-json-fix.htmimi.com/1json'},
        sit:{left:'sit.', right:'.hd', protocol:'http:', proxyStr:'ht-json-sit.hd/mj', olbProxyStr:'ht-json-sit.hd/1json'},
        stress:{left:'stress.', right:'.hd', protocol:'http:', proxyStr:'ht-json-stress.hd/mj', olbProxyStr:'ht-json-stress.hd/1json'},
        stg:{left:'ht-', right:'-stg.htmimi.com', protocol:'https:', proxyStr:'ht-json-stg.htmimi.com/mj', olbProxyStr:'ht-json-stg.htmimi.com/1json'},
        release:{left:'ht-', right:'.htmimi.com', protocol:'http:', proxyStr:'ht-json.htmimi.com/mj', olbProxyStr:'ht-json.htmimi.com/1json'}
      }
    }
  }
  /*获取加密旧请求url*/
	getRequestUrl(api){
		let config = this.conf;
		let url = '';
		if(api && api.substr(0,4) == 'http'){
			url = api;
		}else{
			let env = config.envs[config.envName];
			if(env){
        url = env['protocol'] + '//';
				url += env['left'] + api + env['right'];
			}
		}
		return url;
	}
  /*获取加密新请求url*/
  getNewRequestUrl(){
    let config = this.conf;
    let url = '';
    let env = config.envs[config.envName];
    if(env){
      url = env['protocol'] + '//';
      url +=  'zuul-mj' + env['right'];
    }
    return url;
  }
  /*获取旧代理url*/
	getOldProxyTarget(){
		let config = this.conf;
		let url = config.envs[config.envName]['protocol'] + '//';
		url += config.envs[config.envName]['olbProxyStr'];
		return url;
	}
  /*获取新代理url*/
  getProxyTarget(){
    let config = this.conf;
    let url = config.envs[config.envName]['protocol'] + '//';
    url += config.envs[config.envName]['proxyStr'];
    return url;
  }
}

module.exports =  new Config();
