/**
 * Capture a DOM element as an image using html2canvas
 */
export async function captureElement(selector: string, filename: string = 'seat-plan.png'): Promise<void> {
  const { default: html2canvas } = await import('html2canvas');
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Capture a DOM element as a blob
 */
export async function captureElementAsBlob(selector: string): Promise<Blob | null> {
  const { default: html2canvas } = await import('html2canvas');
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) return null;

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
  });

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/png');
  });
}
