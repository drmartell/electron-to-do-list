const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('todo:add', (_e, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
});

const createAddWindow = () => {
  addWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 300,
    height: 300,
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on('closed', () => addWindow = null); // allow for garbage collection
};

const clearTodos = () => {
  mainWindow.webContents.send('todos:clear');
};

const menuTemplate = [{
  label: 'File',
  submenu: [{
    label: 'New To-Do',
      click() { createAddWindow() }
    }, {
    label: 'Clear',
      click() { clearTodos() }
    }, {
    label: 'Quit',
    click() {
      app.quit();
    },
    accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
  }]
}];

if (process.platform === 'darwin') menuTemplate.unshift({});

if(process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [{
      role: 'reload' // one of Electrons several built-in menu options
    }, {
      label: 'Toggle Developer Tools',
      click(_item, focusedWindow) {
        focusedWindow.toggleDevTools();
      },
      accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
    }]
  })
};