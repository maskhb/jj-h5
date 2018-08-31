export default (_data, _tpl) => {
  let checkType = data => Object.prototype.toString.call(data).match(/\s([a-z]+)/i)[1].toLowerCase()
  let convert = type => {
    let res
    switch (type) {
      case 'number':
        res = 0
        break
      case 'string':
        res = ''
        break
      case 'boolean':
        res = false
        break
      case 'array':
        res = []
        break
      case 'object':
        res = {}
        break
    }
    return res
  }

  let loop = (_data, _tpl, keyName = '') => {
    let [dateType, tplType] = [checkType(_data), checkType(_tpl)]

    if (dateType === 'object' || dateType === 'array') {
      if (dateType !== tplType) {
        console.warn(`接口数据中的${keyName} 与实际定义不一致,已强行过滤`)
        return convert(tplType)
      } else {
        for (let key in _data) {
          if (tplType === 'object' && _tpl.hasOwnProperty(key)) {
            _data[key] = loop(_data[key], _tpl[key], key)
          } else if (tplType === 'array') {
            _data[key] = loop(_data[key], _tpl[0], key)
          } else if (_tpl.hasOwnProperty(key)) {
            _data[key] = loop(_data[key], _tpl[key], key)
          } else {
            console.warn(`接口中发现不存在实际定义中的数据:${key}`)
          }
        }
        return _data
      }
    } else {
      if (dateType !== tplType) {
        console.warn(`接口数据中的${keyName}与实际定义不一致,已强行过滤`)
        return convert(tplType)
      } else {
        return _data
      }
    }
  }

  return loop(_data, _tpl)
}
