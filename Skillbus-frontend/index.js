(() => {
  const SERVER_URL = 'http://localhost:3000/api/clients';
  const TIME_MS_MODAL_OPEN = 500;

  const clientsSearchInput = document.querySelector('.header__search');
  const columnId = document.querySelector('#column-id');
  const columnFio = document.querySelector('#column-fio');
  const columnCreateDate = document.querySelector('#column-createDate');
  const columnLastChange = document.querySelector('#column-lastChange');
  const tableBody = document.querySelector('.clients__table-body');
  const addClientsButton = document.querySelector('.clients__btn');
  const preloader = document.querySelector('.preloader-block');

  let clientsArray = [];
  let time;

  const clients = {
    async getClients() {
      const response = await fetch(SERVER_URL, {
        method: 'Get',
        headers: {
          'Content-Type': 'application/JSON'
        }
      });
      let clientsList = await response.json();

      renderClientsList(clientsList);
    },

    async addClient({ name, surname, lastName, contacts }) {
      const response = await fetch(SERVER_URL, {
        method: 'Post',
        body: JSON.stringify({
          name: name,
          surname: surname,
          lastName: lastName,
          contacts: contacts,
        }),
        headers: {
          'Content-Type': 'application/JSON'
        }
      });

      const data = await response.json();
      console.log('Ошибки: ', data.errors);

      this.getClients();
    },

    async changeClient({ id, name, surname, lastName, contacts }) {
      await fetch(SERVER_URL + `/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: name,
          surname: surname,
          lastName: lastName,
          contacts: contacts,
        }),
        headers: {
          'Content-Type': 'application/JSON'
        }
      });

      this.getClients();
    },

    async deleteClient(id) {
      await fetch(SERVER_URL + `/${id}`, {
        method: 'Delete',
        headers: {
          'Content-Type': 'application/JSON'
        }
      });

      this.getClients();
    }
  }

  const getDateAndTime = {

    getDate(date) {
      const newDate = new Date(date);

      let day = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();

      if (day < 10) day = '0' + String(day);
      if (month < 10) month = '0' + String(month);

      return (day + '.' + month + '.' + year);
    },

    getTime(date) {
      const newDate = new Date(date);

      let hours = newDate.getHours();
      let minutes = newDate.getMinutes();

      return (String(hours) + ':' + String(minutes));
    },

  }

  function notFindClients() {
    const row = document.createElement('tr');
    const cell = document.createElement('td');

    row.classList.add('clients__table-bodyrow');
    cell.classList.add('clients__table-descr');

    cell.colSpan = '6';
    cell.textContent = 'Клиенты не найдены';
    cell.style.textAlign = 'center';

    row.append(cell);
    tableBody.append(row);
  }

  function removeClassListForCloseModal(modal, background) {
    modal.classList.remove('add__modal--open');
    background.classList.remove('add__background--open');
  }

  function createModalForDeleteClients(clientId) {
    const modal = document.createElement('div');
    const modalWrap = document.createElement('div');
    const title = document.createElement('h3');
    const span = document.createElement('span');
    const btnsGroup = document.createElement('div');
    const deleteButton = document.createElement('button');
    const cancelButton = document.createElement('button');
    const exitButton = document.createElement('div');
    const exitRow1 = document.createElement('span');
    const exitRow2 = document.createElement('span');
    const background = document.createElement('div');

    modal.classList.add('add__modal');
    time = setTimeout(() => {
      modal.classList.add('add__modal--open');
      background.classList.add('add__background--open');
    }, 50);
    background.classList.add('add__background');
    background.classList.add('add__background--open');
    modalWrap.classList.add('add__modal-wrap');
    title.classList.add('add__title-delete');
    span.classList.add('add__span');
    btnsGroup.classList.add('add__btns-group');
    deleteButton.classList.add('add__btn-save');
    cancelButton.classList.add('add__btn-cancel');
    exitButton.classList.add('add__exit');
    exitRow1.classList.add('add__exit-span');
    exitRow2.classList.add('add__exit-span');

    title.textContent = 'Удалить клиента';
    span.textContent = 'Вы действительно хотите удалить данного клиента?';
    deleteButton.textContent = 'Удалить';
    cancelButton.textContent = 'Отмена';

    deleteButton.addEventListener('click', () => {
      clients.deleteClient(clientId);

      removeClassListForCloseModal(modal, background);

      clearTimeout(time);
      time = setTimeout(() => {
        modal.remove();
        background.remove();
      }, TIME_MS_MODAL_OPEN);
    });

    cancelButton.addEventListener('click', () => {
      removeClassListForCloseModal(modal, background);

      clearTimeout(time);
      time = setTimeout(() => {
        modal.remove();
        background.remove();
      }, TIME_MS_MODAL_OPEN);
    });

    exitButton.addEventListener('click', () => {
      removeClassListForCloseModal(modal, background);

      clearTimeout(time);
      time = setTimeout(() => {
        modal.remove();
        background.remove();
      }, TIME_MS_MODAL_OPEN);
    });

    btnsGroup.append(deleteButton);
    btnsGroup.append(cancelButton);
    exitButton.append(exitRow1);
    exitButton.append(exitRow2);
    modalWrap.append(title);
    modalWrap.append(span);
    modalWrap.append(btnsGroup);
    modalWrap.append(exitButton);
    modal.append(modalWrap);

    document.body.append(background);
    document.body.append(modal);

    background.addEventListener('click', () => {
      removeClassListForCloseModal(modal, background);

      clearTimeout(time);
      time = setTimeout(() => {
        modal.remove();
        background.remove();
      }, TIME_MS_MODAL_OPEN);
    });
  }

  function createModalForm(client = null) {
    function getContactElement(contactInfo = null) {
      let keyCode;

      function maskTel(event) {
        event.keyCode && (keyCode = event.keyCode);
        let pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        let matrix = "+7 (___)-___-__-__",
          i = 0,
          def = matrix.replace(/\D/g, ""),
          val = this.value.replace(/\D/g, ""),
          new_value = matrix.replace(/[_\d]/g, function (a) {
            return i < val.length ? val.charAt(i++) || def.charAt(i) : a
          });
        i = new_value.indexOf("_");
        if (i != -1) {
          i < 5 && (i = 3);
          new_value = new_value.slice(0, i)
        }
        let reg = matrix.substr(0, this.value.length).replace(/_+/g,
          function (a) {
            return "\\d{1," + a.length + "}"
          }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type == "blur" && this.value.length < 5) this.value = "";
      }

      const contactWrap = document.createElement('div');
      const select = document.createElement('select');
      const optionTel = document.createElement('option');
      const optionEmail = document.createElement('option');
      const optionVk = document.createElement('option');
      const optionFacebook = document.createElement('option');
      const optionAnother = document.createElement('option');
      const input = document.createElement('input');
      const exitElement = document.createElement('div');

      const optionClass = 'add__contacts-option';

      optionTel.textContent = 'Телефон';
      optionEmail.textContent = 'Email';
      optionVk.textContent = 'VK';
      optionFacebook.textContent = 'Facebook';
      optionAnother.textContent = 'Другое';
      input.placeholder = 'Введите данные контакта';

      input.type = 'text';

      contactWrap.classList.add('add__contacts-wrap');
      select.classList.add('add__contacts-select');
      optionTel.classList.add(optionClass);
      optionEmail.classList.add(optionClass);
      optionVk.classList.add(optionClass);
      optionFacebook.classList.add(optionClass);
      optionAnother.classList.add(optionClass);
      input.classList.add('add__contacts-input');
      exitElement.classList.add('add__contacts-exit');

      exitElement.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
          </svg>`;

      exitElement.addEventListener('click', () => {
        contactWrap.remove();
        if (btnsGroupElement.querySelector('.add__error')) errorMsg.remove();
        if (!contactsListElement.querySelector('.add__contacts-wrap')) contactsBackElement.classList.remove('add__contacts--active');
        if (!Array.from(contactsBackElement.children).includes(contactsButtonElement)) contactsBackElement.append(contactsButtonElement);
      });

      select.addEventListener('change', () => {
        if (select.selectedIndex === 1) {
          input.value = '+7';
          input.addEventListener('input', maskTel, false);
        }
      });

      select.append(optionEmail);
      select.append(optionTel);
      select.append(optionVk);
      select.append(optionFacebook);
      select.append(optionAnother);

      contactWrap.append(select);
      contactWrap.append(input);
      contactWrap.append(exitElement);

      contactsListElement.append(contactWrap);

      contactsBackElement.classList.add('add__contacts--active');
      contactsListElement.append(contactWrap);

      if (contactInfo) {
        select.value = contactInfo.type;
        input.value = contactInfo.value;
      }
    }

    function checkName(name) {
      let success = true;
      var reg = new RegExp("^[A-zА-яЁё]+$");

      for (let elem of name) if (!reg.test(elem)) success = false;
      if (name.trim() === '') success = false;

      return success;
    }

    const modalElement = document.createElement('div');
    const formElement = document.createElement('form');
    const formWrap = document.createElement('div');
    const headerElement = document.createElement('div');
    const titleElement = document.createElement('h3');
    const clientIdElement = document.createElement('span');
    const surnameElement = document.createElement('input');
    const nameElement = document.createElement('input');
    const lastNameElement = document.createElement('input');
    const contactsBackElement = document.createElement('div');
    const contactsButtonElement = document.createElement('button');
    const btnsGroupElement = document.createElement('div');
    const saveButtonElement = document.createElement('button');
    const cancelButtonElement = document.createElement('button');
    const exitButtonElement = document.createElement('div');
    const exitRow1 = document.createElement('span');
    const exitRow2 = document.createElement('span');
    const background = document.createElement('div');
    const icon = document.createElement('div');

    const contactsListElement = document.createElement('div');
    contactsListElement.classList.add('add__contacts-list');

    const errorMsg = document.createElement('span');
    errorMsg.classList.add('add__error');

    modalElement.classList.add('add__modal');
    background.classList.add('add__background');
    clearTimeout(time);
    time = setTimeout(() => {
      modalElement.classList.add('add__modal--open');
      background.classList.add('add__background--open');
    }, 50);
    formElement.classList.add('add__form');
    formWrap.classList.add('add__form-wrap');
    headerElement.classList.add('add__header');
    titleElement.classList.add('add__title');
    clientIdElement.classList.add('add__id');
    surnameElement.classList.add('add__input');
    nameElement.classList.add('add__input');
    lastNameElement.classList.add('add__input');
    contactsBackElement.classList.add('add__contacts');
    icon.classList.add('add__icon');
    contactsButtonElement.classList.add('add__contacts-btn');
    btnsGroupElement.classList.add('add__btns-group');
    saveButtonElement.classList.add('add__btn-save');
    cancelButtonElement.classList.add('add__btn-cancel');
    exitButtonElement.classList.add('add__exit');
    exitRow1.classList.add('add__exit-span');
    exitRow2.classList.add('add__exit-span');

    surnameElement.type = 'text';
    nameElement.type = 'text';
    lastNameElement.type = 'text';
    surnameElement.placeholder = 'Фамилия';
    nameElement.placeholder = 'Имя';
    lastNameElement.placeholder = 'Отчество';
    contactsButtonElement.textContent = 'Добавить контакт';
    saveButtonElement.textContent = 'Сохранить';

    if (client) {
      titleElement.textContent = 'Изменить данные';
      clientIdElement.textContent = `ID: ${client.id}`;
      cancelButtonElement.textContent = 'Удалить клиента';

      surnameElement.value = client.surname;
      nameElement.value = client.name;
      lastNameElement.value = client.lastName;

      client.contacts.map((type, value) => {
        getContactElement(type, value);
      })

      cancelButtonElement.addEventListener('click', event => {
        event.preventDefault();

        removeClassListForCloseModal(modalElement, background);

        clearTimeout(time);
        time = setTimeout(() => {
          modalElement.remove();
          background.remove();

          createModalForDeleteClients(client.id);
        }, TIME_MS_MODAL_OPEN);
      });

      window.location.hash = client.id;

    } else {
      titleElement.textContent = 'Новый клиент';
      cancelButtonElement.textContent = 'Отмена';

      cancelButtonElement.addEventListener('click', event => {
        event.preventDefault();

        removeClassListForCloseModal(modalElement, background);

        clearTimeout(time);
        time = setTimeout(() => {
          modalElement.remove();
          background.remove();
          window.location.hash = '';
        }, TIME_MS_MODAL_OPEN);
      });
    }

    exitButtonElement.addEventListener('click', event => {
      event.preventDefault();

      removeClassListForCloseModal(modalElement, background);

      clearTimeout(time);
      time = setTimeout(() => {
        modalElement.remove();
        background.remove();
        window.location.hash = '';
      }, TIME_MS_MODAL_OPEN);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key == 'Escape') {
        removeClassListForCloseModal(modalElement, background);

        clearTimeout(time);
        time = setTimeout(() => {
          modalElement.remove();
          background.remove();
          window.location.hash = '';
        }, TIME_MS_MODAL_OPEN);
      }
    });

    background.addEventListener('click', () => {
      removeClassListForCloseModal(modalElement, background);

      clearTimeout(time);
      time = setTimeout(() => {
        modalElement.remove();
        background.remove();
        window.location.hash = '';
      }, TIME_MS_MODAL_OPEN);
    });

    icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_121_1874)">
        <path
        d="M8.00001 4.66665C7.63334 4.66665 7.33334 4.96665 7.33334 5.33331V7.33331H5.33334C4.96668 7.33331 4.66668 7.63331 4.66668 7.99998C4.66668 8.36665 4.96668 8.66665 5.33334 8.66665H7.33334V10.6666C7.33334 11.0333 7.63334 11.3333 8.00001 11.3333C8.36668 11.3333 8.66668 11.0333 8.66668 10.6666V8.66665H10.6667C11.0333 8.66665 11.3333 8.36665 11.3333 7.99998C11.3333 7.63331 11.0333 7.33331 10.6667 7.33331H8.66668V5.33331C8.66668 4.96665 8.36668 4.66665 8.00001 4.66665ZM8.00001 1.33331C4.32001 1.33331 1.33334 4.31998 1.33334 7.99998C1.33334 11.68 4.32001 14.6666 8.00001 14.6666C11.68 14.6666 14.6667 11.68 14.6667 7.99998C14.6667 4.31998 11.68 1.33331 8.00001 1.33331ZM8.00001 13.3333C5.06001 13.3333 2.66668 10.94 2.66668 7.99998C2.66668 5.05998 5.06001 2.66665 8.00001 2.66665C10.94 2.66665 13.3333 5.05998 13.3333 7.99998C13.3333 10.94 10.94 13.3333 8.00001 13.3333Z"
          fill="#9873FF" />
      </g>
      <defs>
        <clipPath id="clip0_121_1874">
        <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>`;

    contactsButtonElement.prepend(icon);
    contactsBackElement.append(contactsButtonElement);
    contactsBackElement.prepend(contactsListElement);
    btnsGroupElement.append(saveButtonElement);
    btnsGroupElement.append(cancelButtonElement);
    exitButtonElement.append(exitRow1);
    exitButtonElement.append(exitRow2);

    headerElement.append(titleElement);
    headerElement.append(clientIdElement);
    formWrap.append(headerElement);
    formWrap.append(surnameElement);
    formWrap.append(nameElement);
    formWrap.append(lastNameElement);

    formElement.append(formWrap);
    formElement.append(contactsBackElement);
    formElement.append(btnsGroupElement);
    formElement.append(exitButtonElement);

    contactsButtonElement.addEventListener('click', event => {
      event.preventDefault();

      getContactElement();

      if (contactsListElement.querySelectorAll('.add__contacts-wrap').length === 10) contactsButtonElement.remove();
    });

    saveButtonElement.addEventListener('click', event => {
      event.preventDefault();

      let errors = 0;

      if (!checkName(surnameElement.value) || !checkName(nameElement.value)) {
        surnameElement.addEventListener('input', () => {
          if (!checkName(surnameElement.value)) { surnameElement.classList.add('add__input-error') }
          else { surnameElement.classList.remove('add__input-error') };
        });

        nameElement.addEventListener('input', () => {
          if (!checkName(nameElement.value)) { nameElement.classList.add('add__input-error') }
          else { nameElement.classList.remove('add__input-error') };
        });

        if (!checkName(nameElement.value)) nameElement.classList.add('add__input-error');
        if (!checkName(surnameElement.value)) surnameElement.classList.add('add__input-error');
        errorMsg.textContent = 'Заполните обязательные поля!';
        btnsGroupElement.prepend(errorMsg);
        errors++;
      }

      const contactsTypeListElem = contactsListElement.querySelectorAll('.add__contacts-select');
      const contactsListElem = contactsListElement.querySelectorAll('.add__contacts-input');

      contactsListElem.forEach((item) => {
        if (item.value.trim() === '') {
          errors++;
          errorMsg.textContent = 'Заполните или удалите созданные контакты!';
          btnsGroupElement.prepend(errorMsg);
        }
        console.log(item.value.length);
      });

      if (errors === 0) {
        errorMsg.remove();

        const contactsList = [];

        for (let i = 0; i < contactsListElem.length; ++i) {
          contactsList.push({ type: contactsTypeListElem[i].value, value: contactsListElem[i].value });
        }

        if (client) {
          clients.changeClient({
            id: client.id,
            name: nameElement.value,
            surname: surnameElement.value,
            lastName: lastNameElement.value,
            contacts: contactsList
          });
        } else {
          clients.addClient({
            name: nameElement.value,
            surname: surnameElement.value,
            lastName: lastNameElement.value,
            contacts: contactsList
          });
        }

        modalElement.remove();
        background.remove();
      }
    });

    modalElement.append(formElement);
    document.body.append(background);
    document.body.append(modalElement);
  }

  function getClientsElement(client) {
    function getContactsElement(array) {
      const ul = document.createElement('ul');
      ul.classList.add('clients__contacts-list');

      array.map(contact => {
        const li = document.createElement('li');
        const button = document.createElement('a');

        button.classList.add('clients__contact-btn');
        const tooltipBlock = document.createElement('div');
        const tooltipType = document.createElement('span');
        const tooltipDescr = document.createElement('span');

        li.classList.add('clients__contacts-item');
        tooltipBlock.classList.add('clients__contacts-tooltip');
        tooltipType.classList.add('clients__contacts-tooltiptype');
        tooltipDescr.classList.add('clients__contacts-tooltipdescr');

        tooltipType.textContent = contact.type + ': ';
        tooltipDescr.textContent = contact.value;

        if (contact.type === 'Телефон') {
          button.href = `tel:${contact.value}`;
          button.innerHTML = `<svg class="clients__contact-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
        <circle cx="8" cy="8" r="8" fill="none"/>
        <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
        </g>
        </svg>
        `;
        } else if (contact.type === 'Email') {
          button.href = `mailto:${contact.value}`;
          button.innerHTML = `<svg class="clients__contact-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z"/>
        </svg>
        `;
        } else if (contact.type === 'VK') {
          button.innerHTML = `<svg class="clients__contact-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g>
          <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z"/>
          </g>
          </svg>
          `;
        } else if (contact.type === 'Facebook') {
          button.innerHTML = `<svg class="clients__contact-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g>
          <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z"/>
          </g>
          </svg>
          `;
        } else if (contact.type === 'Другое') {
          button.innerHTML = `<svg class="clients__contact-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z"/>
          </svg>
          `;
        }

        tooltipBlock.append(tooltipType);
        tooltipBlock.append(tooltipDescr);
        li.append(button);
        li.append(tooltipBlock);
        ul.append(li);
      });

      if (array.length > 4) {
        const li = document.createElement('li');

        ul.classList.add('clients__contact-active');
        li.classList.add('clients__contact-others');

        li.textContent = '+' + String(array.length - 4);
        li.addEventListener('click', () => {
          ul.classList.remove('clients__contact-active');
          li.remove();
        });
        ul.append(li);
      }

      cellContacts.append(ul);
    }

    const startTr = document.createElement('tr');
    const cellId = document.createElement('td');
    const cellFio = document.createElement('td');
    const cellDate = document.createElement('td');
    const wrapDate = document.createElement('div');
    const createdDateElement = document.createElement('span');
    const createdTimeElement = document.createElement('span');
    const cellLastChange = document.createElement('td');
    const wrapLastChange = document.createElement('div');
    const LastChangeDateElement = document.createElement('span');
    const LastChangeTimeElement = document.createElement('span');
    const cellContacts = document.createElement('td');
    const cellActions = document.createElement('td');

    const changeClientButton = document.createElement('button');
    const deleteClientButton = document.createElement('button');
    const changeIcon = document.createElement('div');
    const deleteIcon = document.createElement('div');

    changeIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.7" clip-path="url(#clip0_121_2290)">
    <path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873FF"/>
    </g>
    <defs>
    <clipPath id="clip0_121_2290">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    `;

    deleteIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.7" clip-path="url(#clip0_121_2315)">
    <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
    </g>
    <defs>
    <clipPath id="clip0_121_2315">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    `;

    changeClientButton.textContent = 'Изменить';
    changeClientButton.prepend(changeIcon);
    deleteClientButton.textContent = 'Удалить';
    deleteClientButton.prepend(deleteIcon);

    changeClientButton.classList.add('clients__table-change');
    deleteClientButton.classList.add('clients__table-delete');
    changeIcon.classList.add('clients__table-changeicon');
    deleteIcon.classList.add('clients__table-deleteicon');

    startTr.classList.add('clients__table-bodyrow');
    cellId.classList.add('clients__table-descr');
    cellFio.classList.add('clients__table-descr');
    cellDate.classList.add('clients__table-descr');
    wrapDate.classList.add('cell-date');
    createdDateElement.classList.add('clients__table-date');
    createdTimeElement.classList.add('clients__table-time');
    cellLastChange.classList.add('clients__table-descr');
    wrapLastChange.classList.add('cell-date');
    LastChangeDateElement.classList.add('clients__table-date');
    LastChangeTimeElement.classList.add('clients__table-time');
    cellContacts.classList.add('clients__table-descr');
    cellContacts.classList.add('contacts-cell');
    cellActions.classList.add('clients__table-descr');
    cellActions.classList.add('actions-cell');

    changeClientButton.addEventListener('click', () => createModalForm(client));

    deleteClientButton.addEventListener('click', () => createModalForDeleteClients(client.id));

    cellId.textContent = client.id;
    cellFio.textContent = client.surname + ' ' + client.name + ' ' + client.lastName;

    createdDateElement.textContent = getDateAndTime.getDate(client.createdAt);
    createdTimeElement.textContent = getDateAndTime.getTime(client.createdAt);
    wrapDate.append(createdDateElement);
    wrapDate.append(createdTimeElement);
    cellDate.append(wrapDate);

    LastChangeDateElement.textContent = getDateAndTime.getDate(client.updatedAt);
    LastChangeTimeElement.textContent = getDateAndTime.getTime(client.updatedAt);
    wrapLastChange.append(LastChangeDateElement);
    wrapLastChange.append(LastChangeTimeElement);
    cellLastChange.append(wrapLastChange);

    getContactsElement(client.contacts);

    cellActions.append(changeClientButton);
    cellActions.append(deleteClientButton);

    startTr.append(cellId);
    startTr.append(cellFio);
    startTr.append(cellDate);
    startTr.append(cellLastChange);
    startTr.append(cellContacts);
    startTr.append(cellActions);

    tableBody.append(startTr);
  }

  function sortClientsList(clients, type) {
    tableBody.innerHTML = '';
    let newClientsList = [];

    if (type === 'fio') {
      let classListArray = Array.from(columnFio.classList);

      clients.map(client => {
        const clientFio = client.surname + ' ' + client.name + ' ' + client.lastName + '///' + client.id;
        newClientsList.push(clientFio);
      });

      if (classListArray.includes('column--active')) {
        newClientsList = newClientsList.sort().reverse()
        columnFio.classList.remove('column--active');
      } else {
        newClientsList = newClientsList.sort();
        columnFio.classList.add('column--active');

        columnId.classList.remove('column--active');
        columnCreateDate.classList.remove('column--active');
      }
      newClientsList.map(clientObject => {
        getClientsElement(clients.find(client => client.id === clientObject.split('///')[1]));
      });
    }

    if (type === 'id') {
      let classListArray = Array.from(columnId.classList);

      clients.map(client => newClientsList.push(client.id));

      if (classListArray.includes('column--active')) {
        newClientsList = newClientsList.sort((a, b) => a - b).reverse()
        columnId.classList.remove('column--active');
      } else {
        newClientsList = newClientsList.sort((a, b) => a - b);
        columnId.classList.add('column--active');

        columnFio.classList.remove('column--active');
        columnCreateDate.classList.remove('column--active');
        columnLastChange.classList.remove('column--active');
      }
      newClientsList.map(clientObject => getClientsElement(clients.find(client => client.id === clientObject)));
    }

    if (type === 'createDate') {
      let classListArray = Array.from(columnCreateDate.classList);

      clients.map(client => newClientsList.push(client.createdAt + '///' + client.id));

      if (classListArray.includes('column--active')) {
        newClientsList = newClientsList.sort((a, b) => {
          let c = new Date(a.split('///')[0]);
          let d = new Date(b.split('///')[0]);
          return c - d;
        }).reverse();
        columnCreateDate.classList.remove('column--active');
      } else {
        newClientsList = newClientsList.sort((a, b) => {
          let c = new Date(a.split('///')[0]);
          let d = new Date(b.split('///')[0]);
          return c - d;
        });
        columnCreateDate.classList.add('column--active');

        columnFio.classList.remove('column--active');
        columnId.classList.remove('column--active');
        columnLastChange.classList.remove('column--active');
      }
      newClientsList.map(clientObject => getClientsElement(clients.find(client => client.id === clientObject.split('///')[1])));
    }

    if (type === 'lastChange') {
      let classListArray = Array.from(columnLastChange.classList);

      clients.map(client => newClientsList.push(client.updatedAt + '///' + client.id));

      if (classListArray.includes('column--active')) {
        newClientsList = newClientsList.sort((a, b) => {
          let c = new Date(a.split('///')[0]);
          let d = new Date(b.split('///')[0]);
          return c - d;
        }).reverse();
        columnLastChange.classList.remove('column--active');
      } else {
        newClientsList = newClientsList.sort((a, b) => {
          let c = new Date(a.split('///')[0]);
          let d = new Date(b.split('///')[0]);
          return c - d;
        });
        columnLastChange.classList.add('column--active');

        columnFio.classList.remove('column--active');
        columnId.classList.remove('column--active');
        columnCreateDate.classList.remove('column--active');
      }
      newClientsList.map(clientObject => getClientsElement(clients.find(client => client.id === clientObject.split('///')[1])));
    }
  }

  function renderClientsList(clients, type = null) {
    tableBody.innerHTML = '';

    if (!type) clientsArray = [];

    return clients.map(client => {
      clientsArray.push(client);
      getClientsElement(client);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    let timeout;

    addClientsButton.addEventListener('click', () => createModalForm());

    clientsSearchInput.addEventListener('input', () => {
      preloader.classList.remove('preloader-stop');
      let newClientsList = [];

      clientsArray.map(client => {
        const clientFio = (client.surname + ' ' + client.name + ' ' + client.lastName).toLowerCase();
        if (clientFio.includes(clientsSearchInput.value.toLowerCase())) newClientsList.push(client);
      });

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        tableBody.innerHTML = '';

        if (newClientsList.length == 0 && clientsSearchInput.value === '') { clientsArray.map(client => getClientsElement(client)); }
        else if (newClientsList.length == 0 && !(clientsSearchInput.value === '')) { notFindClients(); }
        else { newClientsList.map(client => getClientsElement(client)); }

        preloader.classList.add('preloader-stop');
      }, 700);
    });

    columnFio.addEventListener('click', () => {
      sortClientsList(clientsArray, 'fio');
    });

    columnId.addEventListener('click', () => {
      sortClientsList(clientsArray, 'id');
    });

    columnCreateDate.addEventListener('click', () => {
      sortClientsList(clientsArray, 'createDate');
    });

    columnLastChange.addEventListener('click', () => {
      sortClientsList(clientsArray, 'lastChange');
    });

    clients.getClients();

    window.addEventListener('load', () => {
      if (window.location.hash) {
        const selectClient = clientsArray.find(client => '#' + client.id === window.location.hash);

        if (selectClient) {
          if ('#' + selectClient.id === window.location.hash) createModalForm(selectClient);
        }
      }
    });

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      preloader.classList.add('preloader-stop');
    }, TIME_MS_MODAL_OPEN);
  });
})();
