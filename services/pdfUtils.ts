
// Use the legacy build of pdfjs for runtime APIs and point workerSrc to the
// packaged worker file. Vite's ?url loader will emit the worker file and
// provide a runtime URL, avoiding CDN mismatches.
// @ts-ignore - legacy internal path may not have types but Vite will resolve it at runtime
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// Use a static path under `public/` so both dev and build can load the worker
// reliably. The prebuild script copies `node_modules/pdfjs-dist/build/pdf.worker.min.js`
// to `public/pdf.worker.min.js` so the runtime can fetch it at `/pdf.worker.min.js`.
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

/**
 * Converts ALL pages of a PDF file to an array of Base64 Image Strings (PNG).
 * Renders at high scale (2.5) for better AI OCR text extraction.
 */
export const convertPdfToImages = async (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result as ArrayBuffer);

      // Load the PDF document
  const loadingTask = pdfjsLib.getDocument({ data: typedarray });
  const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        const images: string[] = [];

        // Loop through all pages
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);

            // Determine scale. 
            const scale = 2.5; 
            const viewport = page.getViewport({ scale });

            // Prepare canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            if (!context) {
                console.warn(`Could not get 2D context for PDF page ${i}`);
                continue;
            }

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            // Export to Base64 Image
            const base64Image = canvas.toDataURL('image/png');
            images.push(base64Image);
        }

        resolve(images);

      } catch (error) {
        console.error("Error parsing PDF:", error);
        reject(error);
      }
    };

    fileReader.onerror = (error) => reject(error);
    fileReader.readAsArrayBuffer(file);
  });
};
