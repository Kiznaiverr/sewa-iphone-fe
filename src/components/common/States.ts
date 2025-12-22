export function EmptyState(title: string, message: string, actionText: string | null = null, actionLink: string | null = null) {
  return `
    <div class="flex flex-col items-center justify-center py-16">
      <div class="w-20 h-20 bg-neutral-200 rounded-full flex-center mb-4">
        <svg class="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-neutral-900 mb-2">${title}</h3>
      <p class="text-neutral-500 text-center mb-6 max-w-sm">${message}</p>
      ${actionText && actionLink ? `
        <a href="${actionLink}" data-link class="btn btn-primary">${actionText}</a>
      ` : ''}
    </div>
  `;
}

export function ErrorMessage(message: string, retry: (() => void) | null = null) {
  return `
    <div class="alert alert-error">
      <div class="flex-between">
        <div>
          <h4 class="font-bold mb-1">Terjadi Kesalahan</h4>
          <p>${message}</p>
        </div>
        ${retry ? `<button onclick="${retry}()" class="btn btn-sm btn-secondary">Coba Lagi</button>` : ''}
      </div>
    </div>
  `;
}

export function SuccessMessage(message: string) {
  return `
    <p class="text-success font-medium">${message}</p>
  `;
}