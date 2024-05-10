export function findChildrenByUid(obj, uid) {
  if (obj.uid === uid) {
    return obj;
  }
  
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      const result = findChildrenByUid(obj[key], uid);
      if (result) {
        return result;
      }
    }
  }
  
  return null;
}

export function addObjectKeyByUid(obj, uid, key, value) {
  if (obj.uid === uid) {
    obj[key] = value;
    return obj;
  }
  
  for (let prop in obj) {
    if (typeof obj[prop] === 'object') {
      const result = addObjectKeyByUid(obj[prop], uid, key, value);
      if (result) {
        return obj;
      }
    }
  }
  
  return null;
}