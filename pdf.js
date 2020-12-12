var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = "http://mozilla.github.io/pdf.js/build/pdf.worker.js";

class PDFViewer {

    constructor(container, path) {
        this.versoIndex = null;
        this.rectoIndex = null;
        this.scale = 1.5;
        this.pages = [];
        this.container = container;
        this.path = path;
        this.load();
    }

    load() {
        var _that = this;
        pdfjsLib.getDocument(_that.path).promise.then(function(_pdf) {
            _that.pdf = _pdf;
            _that.numPages = _pdf.numPages;
            _that.initLoadedPDF();
        }, function (reason) {
            console.error(reason);
        });
    }

    initLoadedPDF() {
        for (var i = 0; i < this.numPages; i++) {
            this.initPage(i);
        }
    }

    initPage(index) {
        var _that = this;
        var div = document.createElement("div");
        var canvas = document.createElement("canvas");
        canvas.setAttribute("class", "pdf-page");
        div.style.display = "none";
        div.appendChild(canvas);
        div.setAttribute("class", "page-container");
        this.container.appendChild(div);
        this.pages.push(div);
        this.pdf.getPage(index + 1).then(function (page) {
            var viewport = page.getViewport({scale: _that.scale});
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
              canvasContext: canvas.getContext("2d"),
              viewport: viewport
            };
            page.render(renderContext).promise.then(function() {
                if (index == 0) {
                    _that.renderFirstPage();
                }
            }, function (reason) {
                console.error(reason);
            });
        });
    }

    hideAllPages() {
        for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].style.display = "none";
        }
    }

    shodAllPages() {
        for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].style.display = "block";
        }
    }

    showPage(index) {
        if (index != null) {
            this.pages[index].style.display = "block";   
        }
    }

    renderFirstPage() {
        this.renderIndeces(null, 0);
    }

    renderLastPage() {
        if (this.numPages % 2 == 0) {
            this.renderIndeces(this.numPages - 1, null);
        } else {
            this.renderIndeces(this.numPages - 2, this.numPages - 1);
        }
    }

    renderNextSpreads() {
        if (this.rectoIndex != null && this.rectoIndex != this.numPages - 1) {
            this.renderIndeces(this.rectoIndex + 1, this.rectoIndex != this.numPages - 2 ? this.rectoIndex + 2 : null);
        }
    }

    renderPrevSpreads() {
        if (this.versoIndex != null) {
            this.renderIndeces(this.versoIndex > 1 ? this.versoIndex - 2 : null, this.versoIndex - 1);
        }
    }

    renderIndeces(versoIndex, rectoIndex) {
        console.log("rendering:", versoIndex, rectoIndex);
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