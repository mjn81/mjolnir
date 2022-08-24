export const dynamicAccessor = (obj: object, propString: string) => {
  if (!propString) return obj;

  let prop,
    props = propString.split('.');
  
  let i = 0
  
  for (let iLen = props.length - 1; i < iLen; i++) {
    prop = props[i];

    let candidate = obj[prop];
    if (candidate !== undefined) {
      obj = candidate;
    } else {
      break;
    }
  }
  return obj[props[i]];
};
