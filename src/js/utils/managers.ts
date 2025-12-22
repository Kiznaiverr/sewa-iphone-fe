interface ValidationRule {
  type: string;
  message: string;
  value?: any;
  validator?: (value: any) => boolean;
}

export class FormValidator {
  form: HTMLElement | null;
  errors: Record<string, string[]>;

  constructor(formId: string) {
    this.form = document.getElementById(formId);
    this.errors = {};
  }

  validate(fieldName: string, value: any, rules: ValidationRule[]) {
    const fieldErrors: string[] = [];

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

  executeRule(rule: ValidationRule, value: any) {
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
        return rule.validator ? rule.validator(value) : true;
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
      const field = this.form!.querySelector(`[name="${fieldName}"]`) as HTMLElement;
      const errorContainer = field?.parentElement?.querySelector('.error-message') as HTMLElement;

      if (errorContainer) {
        errorContainer.textContent = this.errors[fieldName][0];
        errorContainer.style.display = 'block';
        field.classList.add('input-error');
      }
    });
  }

  clearErrors() {
    this.errors = {};
    this.form!.querySelectorAll('.error-message').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    this.form!.querySelectorAll('.input-error').forEach(el => {
      (el as HTMLElement).classList.remove('input-error');
    });
  }

  getData() {
    const formData = new FormData(this.form as HTMLFormElement);
    const data: Record<string, any> = {};

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
  table: HTMLElement | null;
  data: any[];
  currentPage: number;
  itemsPerPage: number;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';

  constructor(tableId: string) {
    this.table = document.getElementById(tableId);
    this.data = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.sortField = null;
    this.sortDirection = 'asc';
  }

  setData(data: any[]) {
    this.data = data;
    this.render();
  }

  addRow(data: any) {
    this.data.push(data);
    this.render();
  }

  deleteRow(index: number) {
    this.data.splice(index, 1);
    this.render();
  }

  updateRow(index: number, data: any) {
    this.data[index] = { ...this.data[index], ...data };
    this.render();
  }

  sort(field: string) {
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

  filter(predicate: (item: any) => boolean) {
    const filtered = this.data.filter(predicate);
    return filtered;
  }

  search(query: string, fields: string[]) {
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

  setPage(page: number) {
    this.currentPage = Math.max(1, Math.min(page, this.getTotalPages()));
    this.render();
  }

  render() {
    if (!this.table) return;

    const tbody = this.table.querySelector('tbody');
    if (!tbody) return;

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
  state: Record<string, any>;
  listeners: Set<(state: Record<string, any>) => void>;

  constructor(initialState: Record<string, any> = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  setState(updates: Record<string, any>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  getState() {
    return this.state;
  }

  subscribe(listener: (state: Record<string, any>) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export class CacheManager {
  cache: Map<string, { value: any; timestamp: number }>;
  ttl: number;

  constructor(ttl: number = 5 * 60 * 1000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key: string, value: any) {
    const timestamp = Date.now();
    this.cache.set(key, { value, timestamp });
  }

  get(key: string) {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key: string) {
    return this.get(key) !== null;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}
