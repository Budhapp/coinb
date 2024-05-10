export function validateField (type: string, value: string){
    switch (type) {
      case 'email': {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            return reg.test(value)
        }
      default:
        return true;
    }
  };
