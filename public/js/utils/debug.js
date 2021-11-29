export const reportProperty = (id, object, ...propertyNames) => {
  let container = document.createElement('div');
  propertyNames = [].concat.apply(propertyNames);
  for(const name of propertyNames) {
    let message = document.createElement('p');
    $(message).html(`Object[${id}] - property(${name}): ${object[name]}`);
    $(container).append(message);
  }
  $('.debug').append(container);
}

export const reportLog = log => {
  let container = document.createElement('div');
  $(container).addClass('inputR');
  while(log.length > 0) {
    const input = log.pop( );
    const set = document.createElement('div');
    $(set).addClass('flex');
    for(const entry of input.set) {
      let p = document.createElement('p');
      $(p).html(entry);
      $(set).append(p);
    }
    $(container).append(set);
  }
  $('.debug').append(container);
}
