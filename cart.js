/* this whole file is cart logic, break it and nothing works - don't touch unless you know what you're doing, twin */

const Cart = (() => {
  const KEY = "rc_cart_v1";
  let items = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } })();
  const listeners = [];

  function save() { localStorage.setItem(KEY, JSON.stringify(items)); }
  function emit() { listeners.forEach(fn => fn()); }
  function subscribe(fn) { listeners.push(fn); }

  function add(productId, variantName, price, sellauthUrl, abbr, productName) {
    const existing = items.find(i => i.productId === productId && i.variantName === variantName);
    if (existing) { existing.qty += 1; }
    else { items.push({ productId, variantName, price, sellauthUrl, abbr, productName, qty: 1 }); }
    save();
    emit();
  }

  function remove(productId, variantName) {
    items = items.filter(i => !(i.productId === productId && i.variantName === variantName));
    save();
    emit();
  }

  function clear() { items = []; save(); emit(); }
  function total() { return items.reduce((s, i) => s + i.price * i.qty, 0); }
  function count() { return items.reduce((s, i) => s + i.qty, 0); }
  function getItems() { return [...items]; }

  return { add, remove, clear, total, count, getItems, subscribe };
})();
