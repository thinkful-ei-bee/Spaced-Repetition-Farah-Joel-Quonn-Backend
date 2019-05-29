function buildList(list) {
  const words = [
    'zhōu',
    'nián',
    'jīntiān',
    'míngtiān',
    'zuótiān',
    'rìlì',
    'miǎo',
    'xiǎoshí',
    'fēnzhōng',
    'zhōngbiǎo'
  ]
  
  if (list.head === null) {
    words.forEach(word => {
      list.insertLast(word)
    });
  }

  return list
}

module.exports = { buildList }