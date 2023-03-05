const { readFile, writeFile } = require("fs/promises");
const path = require("path");

const contactsPath = path.resolve("db", "contacts.json");

/**
 * @returns {Promise<Array<object>>} - Contacts Array
 */
async function listContacts() {
  try {
    const contacts = JSON.parse(await readFile(contactsPath));

    return contacts;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param {string} contactId
 * @returns {Promise<object>} contact object
 */
async function getContactById(contactId) {
  try {
    const contacts = await listContacts(contactsPath);

    const resContact = contacts.filter(
      (contact) => contactId === contact.id
    )[0];
    if (!resContact) {
      console.log(`Contact with id ${contactId} isn't found`);
      return {};
    }
    return resContact;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param {string} contactId
 * @returns {Promise<object>} removed object
 */
async function removeContact(contactId) {
  try {
    const removedContact = await getContactById(contactId);

    const contacts = await listContacts(contactsPath);
    const resContact = contacts.filter((contact) => contactId !== contact.id);

    await writeFile(contactsPath, JSON.stringify(resContact));

    return removedContact;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @returns {Promise<object>} addContact
 */
async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts(contactsPath);

    let id = null;

    for (let index = 0; index < contacts.length; index++) {
      if (+contacts[index].id - 1 !== index) {
        id = String(index + 1);
        break;
      }
      if (index === contacts.length - 1) {
        id = `${Number(contacts[index].id) + 1}`;
      }
    }

    const addedContact = { id, name, email, phone };

    contacts.splice(Number(id) - 1, 0, addedContact);

    await writeFile(contactsPath, JSON.stringify(contacts));

    return addedContact;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
