const DB_NAME = 'Minimalist';
const DB_VERSION = 3;
const KEY_MODULE = 'Modules';
const KEY_VERSION = 'version';
const KEY_LEGACY_DB = 'legacyBackup';
const KEY_UPDATED = 'hasUpdated';

class Database {
    constructor() {
        this._preferences = {
            isEnabled: true
        };
        this._db = null;
        this._modules = []
        this._reloadOnSave = false;
    }

    load() {
        return Promise.all([
            this._loadDB(),
            this._loadLocalStorage,
        ]);
    }

    /**
     * Persist preferences and modules
     */
    save() {
        return Promise.all([
            this._saveDB(),
            this._saveLocalStorage,
        ]);
    }

    _saveDB() {
        console.debug('Saving modules...');
        this.write(0, this.getModules().length);
        return Promise.resolve();
    }

    _saveLocalStorage() {
        console.debug('Saving preferences...');
        _.each(this.getPreferences(), (value, key) => {
            localStorage.setItem(key, value);
        });
        return Promise.resolve();
    }

    _loadDB() {
        return new Promise((resolve, reject) => {
            let request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = () => {
                console.debug('Migrating database...');
                if (!request.result.objectStoreNames.contains(KEY_MODULE)) {
                    request.result.createObjectStore(KEY_MODULE, {keyPath: 'index'});
                }
                this._reloadOnSave = true;
            };

            request.onsuccess = () => {
                this._db = request.result;
                this._unpackModules().then(resolve);
            };

            request.onerror = () => {
                console.error('Failed to load database');
                reject();
            };
        })
    }

    _loadLocalStorage() {
        console.debug('Loading preferences...');
        for (let option in this._preferences) {
            if (_.isNull(localStorage.getItem(option))) {
                // Load preference to runtime
                this._preferences[option] = localStorage.getItem(option);
            }
            else {
                // Save default preference
                localStorage.getItem(option) = this._preferences[option];
            }
        }
        return Promise.resolve();
    }

    getPreferences() {
        return this._preferences;
    }

    setPreferences(preferences) {
        this._preferences = preferences;
    }

    getModules() {
        return this._modules;
    }

    getModule(index) {
        return this.getModules()[index];
    }

    setModules(modules) {
        this._modules = modules;
    }

    /**
     * Unpacks module data from local database
     * @return  {Promise}
     */
    _unpackModules() {
        return new Promise((resolve, reject) => {
            console.debug('Loading modules...');
            let request = this._db
                .transaction(KEY_MODULE)
                .objectStore(KEY_MODULE)
                .openCursor()
            ;
            request.onsuccess = () => {
                let cursor = request.result;
                if (!cursor) {
                    resolve();
                }
                else {
                    this._modules.push(new Module(cursor.value.data));
                    cursor.advance(1);
                }
            };
        });
    }

    /**
     * Adds module to database
     * @param {Object}   module   module to add to database
     * @return {Promise}
     */
    add(module) {
        return new Promise((resolve, reject) => {
            let request = this._db
                .transaction(KEY_MODULE, 'readwrite')
                .objectStore(KEY_MODULE)
                .put({
                    'data': module,
                    'index': module.index
                })
            ;
            request.onsuccess = resolve;
            request.onerror = () => {
                console.error(`Failed to add module ${module.getName()}`);
                reject();
            };
        })
    }

    /**
     * Deletes module from database
     * @param  {int}      index    index of module to delete
     * @return  {Promise}
     */
    remove(index) {
        return new Promise((resolve, reject) => {
            let request = this._db
                .transaction([KEY_MODULE], 'readwrite')
                .objectStore(KEY_MODULE)
                .delete(index)
            ;
            request.onsuccess = resolve;
            request.onerror = () => {
                console.error(`Failed to remove module ${module.getName()}`);
                reject();
            };
        })
    }

    /**
     * Deletes the database and localStorage
     * @return {Promise}
     */
    reset() {
        return new Promise((resolve, reject) => {
            console.debug('reseting data...');
            let request = indexedDB.deleteDatabase(DB_NAME);
            request.onerror = request.onsuccess = () => {
                resolve();
                window.location.reload();
            };
        })
    }

    /**
     * Recursively write modules to database
     * @param  {int} index current index
     * @param  {int} total total modules
     * @return {Promise}
     */
    write(index, total) {
        if (index < total) {
            this._modules[index].index = index;
            console.debug(`saving ${this.getModule(index).getName()}...`);
            return this.add(this.getModule(index)).then(() => {
                return this.write(index + 1, total);
            });
        }
        else {
            return this.clean(index);
        }
    }

    /**
     * Trim extra object store indexes
     * @param  {int} index index to start purge
     * @return {Promise}
     */
    clean(index) {
        if (index < this.getModules().length) {
            return this.remove(index).then(() => {
                return this.clean(index + 1);
            });
        }
        else {
            if (this._reloadOnSave) {
                window.location.reload();
            }
            return Promise.resolve();
        }
    }

    /**
     * Disable module or Minimalist
     * @param  {int} index index of module to disable (-1 if Minimalist)
     */
    disable(index) {
        if (index < 0) {
            this.getPreferences().isEnabled = false;
            console.debug('Minimalist disabled');
        }
        else {
            let module = this.getModule(index);
            module.isEnabled = false;
            console.debug(`${module.getName()} disabled`);
        }
        this.save();
    }

    /**
     * Enable module or Minimalist
     * @param  {int} index index of module to disable (-1 if Minimalist)
     */
    enable(index) {
        if (index < 0) {
            this.getPreferences().isEnabled = true;
            console.debug('Minimalist enabled');
        }
        else {
            let module = this.getModule(index);
            module.isEnabled = true;
            console.debug(`${module.getName()} enabled`);
        }
        this.save();
    }

    /**
     * Gets index of module with given metadata
     * @param  {String} name   name of module
     * @param  {String} author name of module author
     * @return {int} index of module, -1 if not installed
     */
    getModuleIndex(name, author) {
        return _.findIndex(this.getModules(), {
            name: name,
            author: author,
        });
    }


    /**
     * Installs or updates given module
     * @param {Object} module module to be added
     */
    installModule(module) {
        let index = this.getModuleIndex(module.name, module.author);
        if (index < 0) {
            // module not installed, add it
            this.getModules().push(new Module(module));
        } else {
            // module installed, update it
            this.getModules()[index] = new Module(module);
        }
        this.save();
    }

    /**
     * uninstalls module at given index
     * @param  {int} index index of module to remote
     */
    uninstallModule(index) {
        console.debug(`${this.getModule(index).getName()} deleted`);
        this.getModules().splice(index, 1);
        this.save();
    }

    /**
     * Import raw data, overwriting conflicts
     * @param {String}   data     Raw data
     * @return {Promise}
     */
    importRawData(data) {
        data = JSON.parse(data);

        preferences = data.preferences;
        _.each(data.modules, (newModule) => {
            newModule = new Module(newModule);
            let isReplaced = false;
            _.each(this.getModules(), (oldModule, index) => {
                if (newModule.is(oldModule)) {
                    if (data.isStripped) {
                        newModule.applyOptions(oldModule);
                    }
                    this.getModules()[index] = newModule;
                    isReplaced = true;
                }
            });
            if (!isReplaced) {
                this.installModule(newModule);
            }
        });
        this.save();
    }

    /**
     * Get raw data for export
     * @param {Boolean} strip Strip out option data
     * @return {String} raw data
     */
    getRawData(strip) {
        let modules = _.map(this.getModules(), module => {
            return modules.push(module.serialize(strip));
        });
        return JSON.stringify({
            'version': manifest.version,
            'isStripped': strip,
            'preferences': {
                'isEnabled': preferences.isEnabled
            },
            'modules': exportModules
        });
    }
}

