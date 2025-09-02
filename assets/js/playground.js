
        document.addEventListener('DOMContentLoaded', function() {
            const htmlEditor = document.getElementById('htmlEditor');
            const cssEditor = document.getElementById('cssEditor');
            const jsEditor = document.getElementById('jsEditor');
            const resultFrame = document.getElementById('resultFrame');
            const runCodeBtn = document.getElementById('runCodeBtn');
            const shareCodeBtn = document.getElementById('shareCodeBtn');
            const editorTabs = document.querySelectorAll('.editor-tab');
            const codePanels = document.querySelectorAll('.code-panel');
            const templateSelect = document.getElementById('templateSelect');
            
            // Load saved code if available
            htmlEditor.value = localStorage.getItem('playgroundHtmlCode') || htmlEditor.value;
            cssEditor.value = localStorage.getItem('playgroundCssCode') || cssEditor.value;
            jsEditor.value = localStorage.getItem('playgroundJsCode') || jsEditor.value;
            
            // Run initial code
            updateResult();
            
            // Switch tabs in code editor
            editorTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Update active tab
                    editorTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update active panel
                    const tabId = this.dataset.tab;
                    codePanels.forEach(panel => {
                        panel.classList.remove('active');
                        if (panel.id === `${tabId}Editor`) {
                            panel.classList.add('active');
                        }
                    });
                });
            });
            
            // Run code button click
            runCodeBtn.addEventListener('click', updateResult);
            
            // Share code button click
            shareCodeBtn.addEventListener('click', shareCode);
            
            // Template selection
            templateSelect.addEventListener('change', function() {
                loadTemplate(this.value);
            });
            
            // Auto-run on code change (with debounce)
            let debounceTimer;
            [htmlEditor, cssEditor, jsEditor].forEach(editor => {
                editor.addEventListener('input', function() {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(updateResult, 1000);
                    
                    // Save code to localStorage
                    localStorage.setItem('playgroundHtmlCode', htmlEditor.value);
                    localStorage.setItem('playgroundCssCode', cssEditor.value);
                    localStorage.setItem('playgroundJsCode', jsEditor.value);
                });
            });
            
            // Check URL parameters for shared code
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('html') || urlParams.has('css') || urlParams.has('js')) {
                if (urlParams.has('html')) {
                    htmlEditor.value = decodeURIComponent(urlParams.get('html'));
                }
                if (urlParams.has('css')) {
                    cssEditor.value = decodeURIComponent(urlParams.get('css'));
                }
                if (urlParams.has('js')) {
                    jsEditor.value = decodeURIComponent(urlParams.get('js'));
                }
                updateResult();
            }
            
            function updateResult() {
                // Create result document
                const html = htmlEditor.value;
                const css = cssEditor.value;
                const js = jsEditor.value;
                
                const result = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>${css}</style>
                    </head>
                    <body>
                        ${html}
                        <script>${js}</script>
                    </body>
                    </html>
                `;
                
                // Update iframe content
                const iframe = document.getElementById('resultFrame');
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(result);
                iframeDoc.close();
            }
            
            function shareCode() {
                // Compress code to URL parameters
                const html = encodeURIComponent(htmlEditor.value);
                const css = encodeURIComponent(cssEditor.value);
                const js = encodeURIComponent(jsEditor.value);
                
                const shareUrl = `${window.location.origin}${window.location.pathname}?html=${html}&css=${css}&js=${js}`;
                
                // Copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(() => {
                    alert('Share URL copied to clipboard!');
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                    prompt('Copy this URL to share your code:', shareUrl);
                });
            }
            
            function loadTemplate(templateName) {
                let html = '', css = '', js = '';
                
                switch (templateName) {
                    case 'basic':
                        html = `<!DOCTYPE html>\n<html>\n<head>\n    <title>Page Title</title>\n</head>\n<body>\n\n    <h1>Hello, World!</h1>\n    <p>This is my first web page.</p>\n    <button id="myButton">Click me!</button>\n\n</body>\n</html>`;
                        css = `body {\n    font-family: Arial, sans-serif;\n    margin: 20px;\n    background-color: #f0f0f0;\n}\n\nh1 {\n    color: #3498db;\n}\n\nbutton {\n    background-color: #3498db;\n    color: white;\n    border: none;\n    padding: 10px 15px;\n    border-radius: 4px;\n    cursor: pointer;\n    transition: background-color 0.3s;\n}\n\nbutton:hover {\n    background-color: #2980b9;\n}`;
                        js = `document.getElementById('myButton').addEventListener('click', function() {\n    alert('Button clicked!');\n    \n    // Change heading color\n    document.querySelector('h1').style.color = '#e74c3c';\n});`;
                        break;
                    case 'bootstrap':
                        html = `<!DOCTYPE html>\n<html>\n<head>\n    <title>Bootstrap Example</title>\n    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">\n</head>\n<body>\n\n    <div class="container mt-5">\n        <div class="row">\n            <div class="col-md-6">\n                <div class="card">\n                    <div class="card-header bg-primary text-white">\n                        Feature Card\n                    </div>\n                    <div class="card-body">\n                        <h5 class="card-title">Special Feature</h5>\n                        <p class="card-text">This is a special feature card with Bootstrap styling.</p>\n                        <button class="btn btn-primary">Learn More</button>\n                    </div>\n                </div>\n            </div>\n            <div class="col-md-6">\n                <h2>About Us</h2>\n                <p>This is a Bootstrap example with a responsive grid layout.</p>\n                <button class="btn btn-success" id="showAlert">Click Me</button>\n            </div>\n        </div>\n    </div>\n\n    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>\n</body>\n</html>`;
                        css = `/* Custom CSS on top of Bootstrap */\n.card {\n    box-shadow: 0 4px 8px rgba(0,0,0,0.1);\n    transition: 0.3s;\n}\n\n.card:hover {\n    box-shadow: 0 8px 16px rgba(0,0,0,0.2);\n    transform: translateY(-5px);\n}\n\n.btn {\n    border-radius: 20px;\n}`;
                        js = `document.getElementById('showAlert').addEventListener('click', function() {\n    alert('Bootstrap is awesome!');\n});\n`;
                        break;
                    case 'flex':
                        html = `<!DOCTYPE html>\n<html>\n<head>\n    <title>Flexbox Layout Example</title>\n</head>\n<body>\n    <div class="flex-container">\n        <div class="flex-item">Item 1</div>\n        <div class="flex-item">Item 2</div>\n        <div class="flex-item">Item 3</div>\n        <div class="flex-item">Item 4</div>\n        <div class="flex-item">Item 5</div>\n        <div class="flex-item">Item 6</div>\n    </div>\n    \n    <div class="controls">\n        <button id="rowBtn">Row</button>\n        <button id="columnBtn">Column</button>\n        <button id="wrapBtn">Toggle Wrap</button>\n        <button id="centerBtn">Center</button>\n        <button id="spaceBtn">Space Between</button>\n    </div>\n</body>\n</html>`;
                        css = `body {\n    font-family: Arial, sans-serif;\n    margin: 20px;\n}\n\n.flex-container {\n    display: flex;\n    flex-direction: row;\n    flex-wrap: nowrap;\n    justify-content: flex-start;\n    align-items: stretch;\n    background-color: #f0f0f0;\n    padding: 20px;\n    min-height: 300px;\n    border: 1px solid #ddd;\n    margin-bottom: 20px;\n}\n\n.flex-item {\n    background-color: #3498db;\n    color: white;\n    padding: 20px;\n    margin: 10px;\n    text-align: center;\n    flex: 0 0 100px;\n}\n\n.controls {\n    margin-top: 20px;\n}\n\nbutton {\n    background-color: #2ecc71;\n    color: white;\n    border: none;\n    padding: 10px 15px;\n    margin-right: 10px;\n    border-radius: 4px;\n    cursor: pointer;\n}\n\nbutton:hover {\n    background-color: #27ae60;\n}`;
                        js = `document.getElementById('rowBtn').addEventListener('click', function() {\n    document.querySelector('.flex-container').style.flexDirection = 'row';\n});\n\ndocument.getElementById('columnBtn').addEventListener('click', function() {\n    document.querySelector('.flex-container').style.flexDirection = 'column';\n});\n\ndocument.getElementById('wrapBtn').addEventListener('click', function() {\n    const container = document.querySelector('.flex-container');\n    if (container.style.flexWrap === 'wrap') {\n        container.style.flexWrap = 'nowrap';\n    } else {\n        container.style.flexWrap = 'wrap';\n    }\n});\n\ndocument.getElementById('centerBtn').addEventListener('click', function() {\n    document.querySelector('.flex-container').style.justifyContent = 'center';\n});\n\ndocument.getElementById('spaceBtn').addEventListener('click', function() {\n    document.querySelector('.flex-container').style.justifyContent = 'space-between';\n});`;
                        break;
                    case 'grid':
                        html = `<!DOCTYPE html>\n<html>\n<head>\n    <title>CSS Grid Layout Example</title>\n</head>\n<body>\n    <div class="grid-container">\n        <div class="grid-item header">Header</div>\n        <div class="grid-item sidebar">Sidebar</div>\n        <div class="grid-item main">Main Content</div>\n        <div class="grid-item footer">Footer</div>\n    </div>\n    \n    <div class="controls">\n        <button id="layout1">Layout 1</button>\n        <button id="layout2">Layout 2</button>\n        <button id="layout3">Layout 3</button>\n    </div>\n</body>\n</html>`;
                        css = `body {\n    font-family: Arial, sans-serif;\n    margin: 20px;\n}\n\n.grid-container {\n    display: grid;\n    grid-template-areas:\n        "header header header"\n        "sidebar main main"\n        "footer footer footer";\n    grid-template-columns: 1fr 2fr 1fr;\n    grid-template-rows: auto 1fr auto;\n    gap: 10px;\n    background-color: #f0f0f0;\n    padding: 10px;\n    height: 400px;\n    border: 1px solid #ddd;\n}\n\n.grid-item {\n    padding: 20px;\n    color: white;\n    text-align: center;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 1.2em;\n}\n\n.header {\n    grid-area: header;\n    background-color: #3498db;\n}\n\n.sidebar {\n    grid-area: sidebar;\n    background-color: #2ecc71;\n}\n\n.main {\n    grid-area: main;\n    background-color: #e74c3c;\n}\n\n.footer {\n    grid-area: footer;\n    background-color: #9b59b6;\n}\n\n.controls {\n    margin-top: 20px;\n}\n\nbutton {\n    background-color: #f39c12;\n    color: white;\n    border: none;\n    padding: 10px 15px;\n    margin-right: 10px;\n    border-radius: 4px;\n    cursor: pointer;\n}`;
                        js = `document.getElementById('layout1').addEventListener('click', function() {\n    const container = document.querySelector('.grid-container');\n    container.style.gridTemplateAreas = \n        '"header header header"\n         "sidebar main main"\n         "footer footer footer"';\n    container.style.gridTemplateColumns = '1fr 2fr 1fr';\n});\n\ndocument.getElementById('layout2').addEventListener('click', function() {\n    const container = document.querySelector('.grid-container');\n    container.style.gridTemplateAreas = \n        '"header header header"\n         "main main sidebar"\n         "footer footer footer"';\n    container.style.gridTemplateColumns = '1fr 1fr 1fr';\n});\n\ndocument.getElementById('layout3').addEventListener('click', function() {\n    const container = document.querySelector('.grid-container');\n    container.style.gridTemplateAreas = \n        '"header sidebar sidebar"\n         "main main main"\n         "footer footer footer"';\n    container.style.gridTemplateColumns = '1fr 1fr 1fr';\n});`;
                        break;
                    case 'animation':
                        html = `<!DOCTYPE html>\n<html>\n<head>\n    <title>CSS Animations Example</title>\n</head>\n<body>\n    <div class="animation-container">\n        <div class="box box1">Box 1</div>\n        <div class="box box2">Box 2</div>\n        <div class="box box3">Box 3</div>\n    </div>\n    \n    <div class="controls">\n        <button id="startBtn">Start Animation</button>\n        <button id="pauseBtn">Pause</button>\n        <button id="changeBtn">Change Animation</button>\n    </div>\n</body>\n</html>`;
                        css = `body {\n    font-family: Arial, sans-serif;\n    margin: 20px;\n}\n\n.animation-container {\n    display: flex;\n    justify-content: space-around;\n    background-color: #f5f5f5;\n    padding: 50px;\n    border: 1px solid #ddd;\n    height: 300px;\n    position: relative;\n}\n\n.box {\n    width: 100px;\n    height: 100px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n    font-weight: bold;\n    border-radius: 10px;\n    animation-duration: 2s;\n    animation-iteration-count: infinite;\n    animation-direction: alternate;\n    animation-timing-function: ease-in-out;\n    animation-play-state: running;\n}\n\n.box1 {\n    background-color: #3498db;\n    animation-name: bounce;\n}\n\n.box2 {\n    background-color: #e74c3c;\n    animation-name: rotate;\n}\n\n.box3 {\n    background-color: #2ecc71;\n    animation-name: pulse;\n}\n\n@keyframes bounce {\n    0% { transform: translateY(0); }\n    100% { transform: translateY(-100px); }\n}\n\n@keyframes rotate {\n    0% { transform: rotate(0deg); }\n    100% { transform: rotate(360deg); }\n}\n\n@keyframes pulse {\n    0% { transform: scale(1); }\n    50% { transform: scale(1.2); }\n    100% { transform: scale(0.8); }\n}\n\n.fade {\n    animation-name: fadeInOut !important;\n}\n\n@keyframes fadeInOut {\n    0% { opacity: 1; }\n    50% { opacity: 0.2; }\n    100% { opacity: 1; }\n}\n\n.controls {\n    margin-top: 20px;\n}\n\nbutton {\n    background-color: #9b59b6;\n    color: white;\n    border: none;\n    padding: 10px 15px;\n    margin-right: 10px;\n    border-radius: 4px;\n    cursor: pointer;\n}`;
                        js = `document.getElementById('startBtn').addEventListener('click', function() {\n    const boxes = document.querySelectorAll('.box');\n    boxes.forEach(box => {\n        box.style.animationPlayState = 'running';\n    });\n});\n\ndocument.getElementById('pauseBtn').addEventListener('click', function() {\n    const boxes = document.querySelectorAll('.box');\n    boxes.forEach(box => {\n        box.style.animationPlayState = 'paused';\n    });\n});\n\ndocument.getElementById('changeBtn').addEventListener('click', function() {\n    const boxes = document.querySelectorAll('.box');\n    boxes.forEach(box => {\n        box.classList.toggle('fade');\n    });\n});`;
                        break;
                }
                
                htmlEditor.value = html;
                cssEditor.value = css;
                jsEditor.value = js;
                updateResult();
                
                // Save to localStorage
                localStorage.setItem('playgroundHtmlCode', html);
                localStorage.setItem('playgroundCssCode', css);
                localStorage.setItem('playgroundJsCode', js);
            }
        });