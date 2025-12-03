export class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.errors = {};
  }

  validate(fieldName, value, rules) {
    const fieldErrors = [];

    rules.forEach(rule => {
      if (!this.executeRule(rule, value)) {
        fieldErrors.push(rule.message);
      }
    });

    if (fieldErrors.length > 0) {
      this.errors[fieldName] = fieldErrors;
    } else {
      delete this.errors[fieldName];
    }

    return fieldErrors.length === 0;
  }

  executeRule(rule, value) {
    switch (rule.type) {
      case 'required':
        return value.trim().length > 0;
      case 'minLength':
        return value.length >= rule.value;
      case 'maxLength':
        return value.length <= rule.value;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^(\+62|62|0)[0-9]{9,12}$/.test(value.replace(/\D/g, ''));
      case 'number':
        return !isNaN(value);
      case 'match':
        return value === rule.value;
      case 'custom':
        return rule.validator(value);
      default:
        return true;
    }
  }

  getErrors() {
    return this.errors;
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  displayErrors() {
    Object.keys(this.errors).forEach(fieldName => {
      const field = this.form.querySelector(`[name="${fieldName}"]`);
      const errorContainer = field?.parentElement.querySelector('.error-message');

      if (errorContainer) {
        errorContainer.textContent = this.errors[fieldName][0];
        errorContainer.style.display = 'block';
        field.classList.add('input-error');
      }
    });
  }

  clearErrors() {
    this.errors = {};
    this.form.querySelectorAll('.error-message').forEach(el => {
      el.style.display = 'none';
    });
    this.form.querySelectorAll('.input-error').forEach(el => {
      el.classList.remove('input-error');
    });
  }

  getData() {
    const formData = new FormData(this.form);
    const data = {};

    formData.forEach((value, key) => {
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    });

    return data;
  }
}

export class TableManager {
  constructor(tableId) {
    this.table = document.getElementById(tableId);
    this.data = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.sortField = null;
    this.sortDirection = 'asc';
  }

  setData(data) {
    this.data = data;
    this.render();
  }

  addRow(data) {
    this.data.push(data);
    this.render();
  }

  deleteRow(index) {
    this.data.splice(index, 1);
    this.render();
  }

  updateRow(index, data) {
    this.data[index] = { ...this.data[index], ...data };
    this.render();
  }

  sort(field) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.data.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];

      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.render();
  }

  filter(predicate) {
    const filtered = this.data.filter(predicate);
    return filtered;
  }

  search(query, fields) {
    const lowercaseQuery = query.toLowerCase();
    return this.data.filter(item =>
      fields.some(field => String(item[field]).toLowerCase().includes(lowercaseQuery))
    );
  }

  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.data.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.data.length / this.itemsPerPage);
  }

  setPage(page) {
    this.currentPage = Math.max(1, Math.min(page, this.getTotalPages()));
    this.render();
  }

  render() {
    if (!this.table) return;

    const tbody = this.table.querySelector('tbody');
    const paginatedData = this.paginate();

    tbody.innerHTML = paginatedData.map((row) => `
      <tr class="border-b border-neutral-200 hover:bg-neutral-50">
        ${Object.values(row).map(value => `
          <td class="px-6 py-3">${value}</td>
        `).join('')}
      </tr>
    `).join('');
  }
}

export class StateManager {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export class CacheManager {
  constructor(ttl = 5 * 60 * 1000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const timestamp = Date.now();
    this.cache.set(key, { value, timestamp });
  }

  get(key) {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}
