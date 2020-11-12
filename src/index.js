const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
let mainWindow;
let newProductWindow;
//When start application, is ready!!
app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true,
    }));
    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);
    mainWindow.on('close', () => {
        app.quit();
    });
});

function createNewProductWindow() {
    newProductWindow = new BrowserWindow({
        width: 400,
        height: 300,
        title: 'Add New Product',
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        }
    });

    newProductWindow.setMenu(null);

    newProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/product.html'),
        protocol: 'file',
        slashes: true
    }));

    newProductWindow.on('close', () => {
        newProductWindow = null;
    })
}


ipcMain.on('product:new', (e, newProduct) => {
    mainWindow.webContents.send('product:new', newProduct);
    newProductWindow.close();
});


const templateMenu = [{
    label: 'File',
    submenu: [{
        label: 'New Product',
        accelerator: 'Ctrl+N',
        click() {
            createNewProductWindow();
        }
    }, {
        label: 'Remove All Products',
        click() {
            mainWindow.webContents.send('products:remove-all');
        }
    }, {
        label: 'Exit',
        accelerator: 'Ctrl+Q',
        click() {
            app.quit();
        }
    }]
}];

if (process.platform === 'darwin') {
    templateMenu.unshift({
        label: app.getName()
    });
}

if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'DevTools',
        submenu: [{
            label: 'Show/Hide Dev Toolss',
            accelerator: 'Ctrl+D',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }, {
            role: 'reload'
        }]
    });
}