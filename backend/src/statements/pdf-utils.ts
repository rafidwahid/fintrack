import * as canvas from 'canvas';


class NodeCanvasFactory {
  create(width: number, height: number) {
    const canvasEl = canvas.createCanvas(width, height);
    const context = canvasEl.getContext('2d');

    return {
      canvas: canvasEl,
      context,
    };
  }

  reset(canvasAndContext: any, width: number, height: number) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext: any) {
    // Canvas elements in Node.js don't need manual cleanup
  }
}

export function setGlobalForPdfLib() {
  const globalAny = global as any;

  // Only set up if not already defined
  if (!globalAny.window) {
    globalAny.window = {};
    globalAny.document = {
      createElement: (element: string) => {
        if (element === 'canvas') {
          return canvas.createCanvas(0, 0);
        }
        return {};
      },
      documentElement: {
        getElementsByTagName: () => [],
      },
    };
    globalAny.navigator = {
      userAgent: 'node',
    };
    globalAny.DOMMatrix = class {};
    globalAny.URL = URL;
    globalAny.Image = canvas.Image;
    globalAny.CanvasRenderingContext2D = canvas.CanvasRenderingContext2D;
    globalAny.DOMParser = class {
      parseFromString() {
        return {
          documentElement: {},
          getElementsByTagName: () => [],
        };
      }
    };
  }

  return new NodeCanvasFactory();
}
