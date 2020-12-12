var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = "http://mozilla.github.io/pdf.js/build/pdf.worker.js";

class PDFViewer {

    constructor(container) {
        this.versoIndex = null;
        this.rectoIndex = null;
        this.scale = 1.5;
        this.canvases = [];
        this.container = container;
    }

    loadPDFFromPath(path) {
        this.path = path;
        var _that = this;
        pdfjsLib.getDocument(_that.path).promise.then(function(_pdf) {
            _that.pdf = _pdf;
            _that.numPages = pdf.numPages;
            _that.initLoadedPDF();
        }, function (reason) {
            console.error(reason);
        });
    }

    initLoadedPDF() {
        for (var i = 0; i < this.numPages; i++) {
            initPage(i);
        }
    }

    initPage(index) {
        var _that = this;
        var div = document.createElement("div");
        var canvas = document.createElement("canvas");
        div.appendChild(canvas);
        this.container.appendChild(canvas);
        this.canvases.push(canvas);
        pdf.getPage(index + 1).then(function (page) {
            var viewport = page.getViewport({scale: _that.scale});
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.display = none;

            var renderContext = {
              canvasContext: canvas.getContext("2d"),
              viewport: viewport
            };
            page.render(renderContext).promise.then(function() {
                canvas.classList.remove("hidden-page");
            }, function (reason) {
                console.error(reason);
            });
        });
    }

    hideAllPages() {
        for (var i = 0; i < this.canvases.length; i++) {
            this.canvases[i].style.display = none;
        }
    }

    shodAllPages() {
        for (var i = 0; i < this.canvases.length; i++) {
            this.canvases[i].style.display = block;
        }
    }

    showPage(index) {
        if (index != null) {
            this.canvases[index].style.display = block;   
        }
    }

    renderFirstPage() {
        this.renderIndeces(null, 0);
    }

    renderLastPage() {
        if (numPages % 2 == 0) {
            this.renderIndeces(this.numPages - 1, null);
        } else {
            this.renderIndeces(this.numPages - 2, this.numPages - 1);
        }
    }

    nextSpreads() { 
        if (this.rectoIndex != null) {
            this.renderIndeces(this.rectoIndex + 1, this.versoIndex != this.numPages - 1 ? this.versoIndex + 1 : null);
        }
    }

    prevSpreads() {
        if (this.versoIndex != null) {
            this.renderIndeces(this.rectoIndex > 0 ? this.rectoIndex : null, this.versoIndex - 1);
        }
    }

    renderIndeces(versoIndex, rectoIndex) {
        this.versoIndex = versoIndex;
        this.rectoIndex = rectoIndex;
        this.hideAllPages();
        this.showPage(versoIndex);
        this.showPage(rectoIndex);
    }

    renderAll() {
        this.versoIndex = null
        this.rectoIndex = null;
        this.showAllPages();
    }


}