class Module {
    constructor(params) {
        for (let param in params) {
            this[param] = params[param];
        }
    }

    getName() {
        return this.name;
    }

    getAuthor() {
        return this.author;
    }

    set(key, value) {
        this[key] = value;
    }

    applyOptions(module) {
        _.each(this.options, (newOption) => {
            _.each(module.options, (oldOption) => {
                if (newOption.description === oldOption.description) {
                    _.each(newOption, (value, key) => {
                        newOption[key] = oldOption[key];
                    });
                }
            });
        });
    }

    migrateOptions(module) {
        this.isEnabled = module.isEnabled;
        _.each(this.options, (newOption) => {
            _.each(module.options, (oldOption) => {
                if (newOption.description === oldOption.description) {
                    newOption.isEnabled = oldOption.isEnabled;
                    _.each(newOption.fields, (field, index) => {
                        field.val = oldOption.fields[index].val;
                    });
                }
            });
        });
    }

    is(module) {
        return (
            this.getName() === module.getName() &&
            this.getAuthor() === module.getAuthor()
        );
    }

    /**
     * Checks if given URL matches this module
     * @param  {String}  url      query URL
     * @return {Boolean}          matches
     */
    matches(url) {
        console.debug(`Checking regex matches for ${url} against ${this.includes}`);
        let includes = this.includes.split(',');
        return _.some(includes, include => {
            return !_.isNull(url.match(toRegExp(include)));
        });
    }

    serialize(strip) {
        let module = _.cloneDeep(this);
        if (strip) {
            _.each(module.options, (option) => {
                _.each(option, (value, key) => {
                    if (!_.includes(['description', 'isEnabled', 'fields'])) {
                        delete option[key];
                    }
                });
            });
        }
        return module;
    }
}
