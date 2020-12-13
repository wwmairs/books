var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = "http://mozilla.github.io/pdf.js/build/pdf.worker.js";

class PDFViewer {

    constructor(container, path, loadCallback) {
        this.versoIndex = null;
        this.rectoIndex = null;
        this.scale = 1.5;
        this.pages = [];
        this.container = container;
        this.path = path;
        this.loadCallback = loadCallback;
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
        var totalPages = this.numPages + 1;
        if (this.numPages % 2 == 0) {
            totalPages += 1;
        }
        for (var i = 0; i < totalPages; i++) {
            this.initPage(i);
        }
        if (this.loadCallback != null) {
            this.loadCallback(this);
        }
    }

    initPage(index) {
        var _that = this;
        var div = document.createElement("div");
        div.style.display = "none";
        div.setAttribute("class", "page-container");
        this.container.appendChild(div);
        this.pages.push(div);
        if (index == 0 || (index == this.numPages + 1 && this.numPages % 2 == 0)) {
        } else {
            var canvas = document.createElement("canvas");
            canvas.setAttribute("class", "pdf-page");
            div.appendChild(canvas);
            this.pdf.getPage(index).then(function (page) {
                var viewport = page.getViewport({scale: _that.scale});
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                div.style.height = viewport.height + "px";

                var renderContext = {
                  canvasContext: canvas.getContext("2d"),
                  viewport: viewport
                };
                page.render(renderContext).promise.then(function() {
                    if (window.screen.width < 750) {
                        _that.showPage(index);
                    } else {
                        if (index == 1) {
                            _that.renderFirstPage();
                        }  
                    }
                }, function (reason) {
                    console.error(reason);
                });
            });
        }
    }

    hideAllPages() {
        for (var i = 0; i < this.pages.length; i++) {
            this.pages[i].style.display = "none";
        }
    }

    showAllPages() {
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
        this.renderIndeces(0, 1);
    }

    renderLastPage() {
        this.renderIndeces(this.numPages, this.numPages + 1);
    }

    renderNextSpreads() {
        if (this.rectoIndex != this.numPages && (this.numPages % 2 == 1 || this.rectoIndex != this.numPages + 1)) {
            this.renderIndeces(this.versoIndex + 2, this.rectoIndex + 2);
        }
    }

    renderPrevSpreads() {
        if (this.versoIndex != 0) {
            this.renderIndeces(this.versoIndex - 2, this.rectoIndex - 2);
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