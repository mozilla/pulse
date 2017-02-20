import blocklist from './blocklist.json';

class DisconnectBlocklist {
  constructor() {
    this.blocklist = this.getBlocklist(blocklist);
    this.hostnames = this.getHostnames(this.blocklist);
  }

  includes(hostname) {
    return this.hostnames.filter(item => {
      return hostname.endsWith(item);
    }).length >= 1;
  }

  getBlocklist(blocklist) {
    delete blocklist.categories['Content'];
    delete blocklist.categories['Legacy Disconnect'];
    delete blocklist.categories['Legacy Content'];
    return blocklist;
  }

  getHostnames(blocklist) {
    const hostnames = [];
    Object.keys(blocklist.categories).forEach(categoryName => {
      const category = blocklist.categories[categoryName];
      category.forEach(entity => {
        Object.keys(entity).forEach(entityName => {
          Object.keys(entity[entityName]).forEach(mainDomain => {
            hostnames.push(...entity[entityName][mainDomain]);
          });
        });
      });
    });
    return hostnames;
  }
}

export default new DisconnectBlocklist();
