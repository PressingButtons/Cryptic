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
