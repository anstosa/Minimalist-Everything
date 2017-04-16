class Updater {
    constructor(db) {
        this.db = db;
        this.version_package = chrome.runtime.getManifest().version;
        this.version_db = localStorage.getItem(KEY_VERSION);
    }

    upgrade() {
        console.debug('Checking for updates...');
        if (_.includes(LEGACY_VERSIONS, this.version_db)) {
            console.warn('INCOMPATIBLE manifest.version FOUND.');
            console.warn('Attempting to backup db to localStorage...');
            localStorage.setItem(KEY_LEGACY_DB, getRawData());
            console.warn('Nuking DB...');
            localStorage.setItem(KEY_UPDATED, true);
            return this.db.reset();
        }
        if (_.isNull()) {
            localStorage.setItem(KEY_VERSION, this.version_package);
            return this.upgradeCoreModules();
        }
        if (this.version_db !== this.version_package) {
            console.info('Updated to version ' + this.version_package);
            localStorage.setItem(KEY_UPDATED, true);
            return this.upgradeCoreModules().then(() => {
                let notification = chrome.notifications.create(NOTIFY_UPGRADE, {
                    type: 'basic',
                    iconUrl: chrome.extension.getURL('icons/128.png'),
                    title: 'Minimalist Updated!',
                    message: 'Minimalist for Everything has been updated.',
                    buttons: [
                        {
                            title: 'See changes'
                        }
                    ]
                }, function(notifications) {
                    chrome.notifications.onClicked.addListener(showDashboard);
                    chrome.notifications.onButtonClicked.addListener(showDashboard);
                });

                localStorage.setItem(KEY_VERSION, this.version_package);
            });
        }
    }

    /**
     * Non-destructively updates core modules
     */
    upgradeCoreModules() {
        console.debug('Updating core modules...');
        let core = [MAIL];
        _.each(core, (data) => {
            let newModule = new Module(data);
            let isFound = false;
            _.each(db.getModules(), (module, index, list) => {
                if (newModule.is(module)) {
                    console.debug(`${newModule.getName()} installed. Preserving options.`);
                    newModule.migrateOptions(module);
                    isFound = true;
                    list[index] = newModule;
                }
            });
            if (!isFound) {
                db.installModule(newModule);
            }
        });
        return db.save();
    }
}
