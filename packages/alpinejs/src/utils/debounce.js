// will this not make more sense, as it's more readable .
export const debounce = (func, delay) => {
  let inDebounce;
  return (...args) => {
    if(inDebounce) clearTimeout(inDebounce);
    inDebounce = setTimeout(()=>{
      func(...args)
    },delay);
  }
}
