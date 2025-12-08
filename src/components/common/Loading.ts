export function LoadingSpinner() {
  return `
    <div class="flex-center">
      <div class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  `;
}

export function LoadingCard() {
  return `
    <div class="card">
      <div class="space-y-4">
        <div class="h-8 bg-neutral-200 rounded animate-pulse"></div>
        <div class="h-6 bg-neutral-200 rounded animate-pulse w-3/4"></div>
        <div class="h-6 bg-neutral-200 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  `;
}